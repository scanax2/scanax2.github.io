// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import {Config} from "../synth/SynthConfig";
import {isMobile} from "./EditorConfig";
import {Pattern, Channel, Song, Synth} from "../synth/synth";
import { SongRecovery, generateUid } from "./SongRecovery";
import { ColorConfig } from "./ColorConfig";
import { Layout } from "./Layout";
import { SongPerformance } from "./SongPerformance";
import { Selection } from "./Selection";
import { Preferences } from "./Preferences";
import { Change } from "./Change";
import { ChangeNotifier } from "./ChangeNotifier";
import {ChangeSong, setDefaultInstruments, discardInvalidPatternInstruments} from "./changes";

// Copied
import { InstrumentType } from "../synth/SynthConfig";
import { NotePin, Note, makeNotePin, Instrument } from "../synth/synth";
import { Preset, EditorConfig } from "./EditorConfig";
import { ChangeGroup } from "./Change";
import { removeDuplicatePatterns, ChangeReplacePatterns } from "./changes";
import { AnalogousDrum, analogousDrumMap, MidiChunkType, MidiFileFormat, MidiEventType, MidiControlEventMessage, MidiMetaEventMessage, MidiRegisteredParameterNumberMSB, MidiRegisteredParameterNumberLSB, midiVolumeToVolumeMult, midiExpressionToVolumeMult } from "./Midi";
import { ArrayBufferReader } from "./ArrayBufferReader";

interface HistoryState {
	canUndo: boolean;
	sequenceNumber: number;
	bar: number;
	channel: number;
	instrument: number;
	recoveryUid: string;
	prompt: string | null;
		selection: {x0: number, x1: number, y0: number, y1: number, start: number, end: number};
}

export class SongDocument {
	public song: Song;
	public synth: Synth;
	public performance: SongPerformance;
	public readonly notifier: ChangeNotifier = new ChangeNotifier();
	public readonly selection: Selection = new Selection(this);
	public readonly prefs: Preferences = new Preferences();
	public channel: number = 0;
	public muteEditorChannel: number = 0;
	public bar: number = 0;
	public recalcChannelNames: boolean;
	public recentPatternInstruments: number[][] = [];
	public viewedInstrument: number[] = [];
	
	public trackVisibleBars: number = 16;
	public trackVisibleChannels: number = 4;
	public barScrollPos: number = 0;
	public channelScrollPos: number = 0;
	public prompt: string | null = null;
	
	public addedEffect: boolean = false;
	public addedEnvelope: boolean = false;
	public currentPatternIsDirty: boolean = false;
	
	private static readonly _maximumUndoHistory: number = 300;
	private _recovery: SongRecovery = new SongRecovery();
	private _recoveryUid: string;
	private _recentChange: Change | null = null;
	private _sequenceNumber: number = 0;
	private _lastSequenceNumber: number = 0;
	private _stateShouldBePushed: boolean = false;
	private _recordedNewSong: boolean = false;
	public _waitingToUpdateState: boolean = false;
	
	public static get observedAttributes() { return ['src']; }

	constructor() {
		this.notifier.watch(this._validateDocState);
		
		ColorConfig.setTheme(this.prefs.colorTheme);
		Layout.setLayout(this.prefs.layout);
		
		if (window.sessionStorage.getItem("currentUndoIndex") == null) {
			window.sessionStorage.setItem("currentUndoIndex", "0");
			window.sessionStorage.setItem("oldestUndoIndex", "0");
			window.sessionStorage.setItem("newestUndoIndex", "0");
		}
			
		let songString: string = window.location.hash;
		if (songString == "") {
			songString = this._getHash();
		}
		this.song = new Song(songString);
		if (songString == "" || songString == undefined) {
			setDefaultInstruments(this.song);
			this.song.scale = this.prefs.defaultScale;
		}
		songString = this.song.toBase64String();
		this.synth = new Synth(this.song);
		this.synth.volume = this._calcVolume();
		this.synth.anticipatePoorPerformance = isMobile;
		
		let state: HistoryState | null = this._getHistoryState();
		if (state == null) {
			// When the page is first loaded, indicate that undo is NOT possible.
			state = {canUndo: false, sequenceNumber: 0, bar: 0, channel: 0, instrument: 0, recoveryUid: generateUid(), prompt: null, selection: this.selection.toJSON()};
		}
		if (state.recoveryUid == undefined) state.recoveryUid = generateUid();
		this._replaceState(state, songString);
		window.addEventListener("hashchange", this._whenHistoryStateChanged);
		window.addEventListener("popstate", this._whenHistoryStateChanged);
			
		this.bar = state.bar | 0;
		this.channel = state.channel | 0;
		for (let i: number = 0; i <= this.channel; i++) this.viewedInstrument[i] = 0;
		this.viewedInstrument[this.channel] = state.instrument | 0;
		this._recoveryUid = state.recoveryUid;
		//this.barScrollPos = Math.max(0, this.bar - (this.trackVisibleBars - 6));
		this.prompt = state.prompt;
		this.selection.fromJSON(state.selection);
			
		// For all input events, catch them when they are about to finish bubbling,
		// presumably after all handlers are done updating the model, then update the
		// view before the screen renders. mouseenter and mouseleave do not bubble,
		// but they are immediately followed by mousemove which does. 
		for (const eventName of ["input", "change", "click", "keyup", "keydown", "mousedown", "mousemove", "mouseup", "touchstart", "touchmove", "touchend", "touchcancel"]) {
			window.addEventListener(eventName, this._cleanDocument);
		}
		
		this._validateDocState();
		this.performance = new SongPerformance(this);
	}

	public _parseMidiFile(buffer: ArrayBuffer): void {
			
		// First, split the file into separate buffer readers for each chunk. There should be one header chunk and one or more track chunks.
		const reader = new ArrayBufferReader(new DataView(buffer));
		let headerReader: ArrayBufferReader | null = null;
		interface Track {
			reader: ArrayBufferReader;
			nextEventMidiTick: number;
			ended: boolean;
			runningStatus: number;
		}
		const tracks: Track[] = [];
			while(reader.hasMore()) {
			const chunkType: number = reader.readUint32();
			const chunkLength: number = reader.readUint32();
			if (chunkType == MidiChunkType.header) {
				if (headerReader == null) {
					headerReader = reader.getReaderForNextBytes(chunkLength);
				} else {
					console.error("This MIDI file has more than one header chunk.");
				}
			} else if (chunkType == MidiChunkType.track) {
				const trackReader: ArrayBufferReader = reader.getReaderForNextBytes(chunkLength);
				if (trackReader.hasMore()) {
					tracks.push({
						reader: trackReader,
						nextEventMidiTick: trackReader.readMidiVariableLength(),
						ended: false,
						runningStatus: -1,
					});
				}
			} else {
				// Unknown chunk type. Skip it.
				reader.skipBytes(chunkLength);
			}
		}
			
		if (headerReader == null) {
			console.error("No header chunk found in this MIDI file.");
			return;
		}
		const fileFormat: number = headerReader.readUint16();
		/*const trackCount: number =*/ headerReader.readUint16();
		const midiTicksPerBeat: number = headerReader.readUint16();
			
		// Midi tracks are generally intended to be played in parallel, but in the format
		// MidiFileFormat.independentTracks, they are played in sequence. Make a list of all
		// of the track indices that should be played in parallel (one or all of the tracks).
		let currentIndependentTrackIndex: number = 0;
		const currentTrackIndices: number[] = [];
		const independentTracks: boolean = (fileFormat == MidiFileFormat.independentTracks);
		if (independentTracks) {
			currentTrackIndices.push(currentIndependentTrackIndex);
		} else {
			for (let trackIndex: number = 0; trackIndex < tracks.length; trackIndex++) {
				currentTrackIndices.push(trackIndex);
			}
		}
			
		interface NoteEvent {
			midiTick: number;
			pitch: number;
			velocity: number;
			program: number;
			instrumentVolume: number;
			instrumentPan: number;
			on: boolean;
		}
		interface PitchBendEvent {
			midiTick: number;
			interval: number;
		}
		interface NoteSizeEvent {
			midiTick: number;
			size: number;
		}
			
		// To read a MIDI file we have to simulate state changing over time.
		// Keep a record of various parameters for each channel that may
		// change over time, initialized to default values.
		// Consider making a MidiChannel class and single array of midiChannels.
			const channelRPNMSB: number[] = [0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff];
			const channelRPNLSB: number[] = [0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff];
			const pitchBendRangeMSB: number[] = [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]; // pitch bend range defaults to 2 semitones.
			const pitchBendRangeLSB: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; // and 0 cents.
			const currentInstrumentProgram: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			const currentInstrumentVolumes: number[] = [100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100];
			const currentInstrumentPans: number[] = [64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64];
			const noteEvents: NoteEvent[][] = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
			const pitchBendEvents: PitchBendEvent[][] = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
		const noteSizeEvents: NoteSizeEvent[][] = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
		let microsecondsPerBeat: number = 500000; // Tempo in microseconds per "quarter" note, commonly known as a "beat", default is equivalent to 120 beats per minute.
		let beatsPerBar: number = 8;
		let numSharps: number = 0;
		let isMinor: boolean = false;
			
		// Progress in time through all tracks (in parallel or in sequence) recording state changes and events until all tracks have ended.
		let currentMidiTick: number = 0;
		while (true) {
			let nextEventMidiTick: number = Number.MAX_VALUE;
			let anyTrackHasMore: boolean = false;
			for (const trackIndex of currentTrackIndices) {
					
				// Parse any events in this track that occur at the currentMidiTick.
				const track: Track = tracks[trackIndex];
				while (!track.ended && track.nextEventMidiTick == currentMidiTick) {
						
					// If the most significant bit is set in the first byte
					// of the event, it's a new event status, otherwise
					// reuse the running status and save the next byte for
					// the content of the event. I'm assuming running status
					// is separate for each track.
					const peakStatus: number = track.reader.peakUint8();
					const eventStatus: number = (peakStatus & 0x80) ? track.reader.readUint8() : track.runningStatus;
					const eventType: number = eventStatus & 0xF0;
					const eventChannel: number = eventStatus & 0x0F;
					if (eventType != MidiEventType.metaAndSysex) {
						track.runningStatus = eventStatus;
					}
						
					let foundTrackEndEvent: boolean = false;
						
					switch (eventType) {
						case MidiEventType.noteOff: {
							const pitch: number = track.reader.readMidi7Bits();
							/*const velocity: number =*/ track.reader.readMidi7Bits();
								noteEvents[eventChannel].push({midiTick: currentMidiTick, pitch: pitch, velocity: 0.0, program: -1, instrumentVolume: -1, instrumentPan: -1, on: false});
						} break;
						case MidiEventType.noteOn: {
							const pitch: number = track.reader.readMidi7Bits();
							const velocity: number = track.reader.readMidi7Bits();
							if (velocity == 0) {
									noteEvents[eventChannel].push({midiTick: currentMidiTick, pitch: pitch, velocity: 0.0, program: -1, instrumentVolume: -1, instrumentPan: -1, on: false});
							} else {
								const volume: number = Math.max(0, Math.min(Config.volumeRange - 1, Math.round(
									Synth.volumeMultToInstrumentVolume(midiVolumeToVolumeMult(currentInstrumentVolumes[eventChannel]))
								)));
								const pan: number = Math.max(0, Math.min(Config.panMax, Math.round(
									((currentInstrumentPans[eventChannel] - 64) / 63 + 1) * Config.panCenter
								)));
								noteEvents[eventChannel].push({
									midiTick: currentMidiTick,
									pitch: pitch,
									velocity: Math.max(0.0, Math.min(1.0, (velocity + 14) / 90.0)),
									program: currentInstrumentProgram[eventChannel],
									instrumentVolume: volume,
									instrumentPan: pan,
									on: true,
								});
							}
						} break;
						case MidiEventType.keyPressure: {
							/*const pitch: number =*/ track.reader.readMidi7Bits();
							/*const pressure: number =*/ track.reader.readMidi7Bits();
						} break;
						case MidiEventType.controlChange: {
							const message: number = track.reader.readMidi7Bits();
							const value: number = track.reader.readMidi7Bits();
							//console.log("Control change, message:", message, "value:", value);
								
							switch (message) {
								case MidiControlEventMessage.setParameterMSB: {
									if (channelRPNMSB[eventChannel] == MidiRegisteredParameterNumberMSB.pitchBendRange && channelRPNLSB[eventChannel] == MidiRegisteredParameterNumberLSB.pitchBendRange) {
										pitchBendRangeMSB[eventChannel] = value;
									}
								} break;
								case MidiControlEventMessage.volumeMSB: {
									currentInstrumentVolumes[eventChannel] = value;
								} break;
								case MidiControlEventMessage.panMSB: {
									currentInstrumentPans[eventChannel] = value;
								} break;
								case MidiControlEventMessage.expressionMSB: {
									noteSizeEvents[eventChannel].push({midiTick: currentMidiTick, size: Synth.volumeMultToNoteSize(midiExpressionToVolumeMult(value))});
								} break;
								case MidiControlEventMessage.setParameterLSB: {
									if (channelRPNMSB[eventChannel] == MidiRegisteredParameterNumberMSB.pitchBendRange && channelRPNLSB[eventChannel] == MidiRegisteredParameterNumberLSB.pitchBendRange) {
										pitchBendRangeLSB[eventChannel] = value;
									}
								} break;
								case MidiControlEventMessage.registeredParameterNumberLSB: {
									channelRPNLSB[eventChannel] = value;
								} break;
								case MidiControlEventMessage.registeredParameterNumberMSB: {
									channelRPNMSB[eventChannel] = value;
								} break;
							}
						} break;
						case MidiEventType.programChange: {
							const program: number = track.reader.readMidi7Bits();
							currentInstrumentProgram[eventChannel] = program;
						} break;
						case MidiEventType.channelPressure: {
							/*const pressure: number =*/ track.reader.readMidi7Bits();
						} break;
						case MidiEventType.pitchBend: {
							const lsb: number = track.reader.readMidi7Bits();
							const msb: number = track.reader.readMidi7Bits();
								
							const pitchBend: number = (((msb << 7) | lsb) / 0x2000) - 1.0;
							const pitchBendRange: number = pitchBendRangeMSB[eventChannel] + pitchBendRangeLSB[eventChannel] * 0.01;
							const interval: number = pitchBend * pitchBendRange;
								
								pitchBendEvents[eventChannel].push({midiTick: currentMidiTick, interval: interval});
						} break;
						case MidiEventType.metaAndSysex: {
							if (eventStatus == MidiEventType.meta) {
								const message: number = track.reader.readMidi7Bits();
								const length: number = track.reader.readMidiVariableLength();
								//console.log("Meta, message:", message, "length:", length);
									
								if (message == MidiMetaEventMessage.endOfTrack) {
									foundTrackEndEvent = true;
									track.reader.skipBytes(length);
								} else if (message == MidiMetaEventMessage.tempo) {
									microsecondsPerBeat = track.reader.readUint24();
									track.reader.skipBytes(length - 3);
								} else if (message == MidiMetaEventMessage.timeSignature) {
									const numerator: number = track.reader.readUint8();
									let denominatorExponent: number = track.reader.readUint8();
									/*const midiClocksPerMetronome: number =*/ track.reader.readUint8();
									/*const thirtySecondNotesPer24MidiClocks: number =*/ track.reader.readUint8();
									track.reader.skipBytes(length - 4);
										
									// A beat is a quarter note. 
									// A ratio of 4/4, or 1/1, corresponds to 4 beats per bar.
									// Apply the numerator first.
									beatsPerBar = numerator * 4;
									// Then apply the denominator, dividing by two until either
									// the denominator is satisfied or there's an odd number of
									// beats. BeepBox doesn't support fractional beats in a bar.
									while ((beatsPerBar & 1) == 0 && (denominatorExponent > 0 || beatsPerBar > Config.beatsPerBarMax) && beatsPerBar >= Config.beatsPerBarMin * 2) {
										beatsPerBar = beatsPerBar >> 1;
										denominatorExponent = denominatorExponent - 1;
									}
									beatsPerBar = Math.max(Config.beatsPerBarMin, Math.min(Config.beatsPerBarMax, beatsPerBar));
								} else if (message == MidiMetaEventMessage.keySignature) {
									numSharps = track.reader.readInt8(); // Note: can be negative for flats.
									isMinor = track.reader.readUint8() == 1; // 0: major, 1: minor
									track.reader.skipBytes(length - 2);
								} else {
									// Ignore other meta event message types.
									track.reader.skipBytes(length);
								}
									
							} else if (eventStatus == 0xF0 || eventStatus == 0xF7) {
								// Sysex events, just skip the data.
								const length: number = track.reader.readMidiVariableLength();
								track.reader.skipBytes(length);
							} else {
								console.error("Unrecognized event status: " + eventStatus);
								return;
							}
						} break;
						default: {
							console.error("Unrecognized event type: " + eventType);
							return;
						}
					}
						
					if (!foundTrackEndEvent && track.reader.hasMore()) {
						track.nextEventMidiTick = currentMidiTick + track.reader.readMidiVariableLength();
					} else {
						track.ended = true;
							
						// If the tracks are sequential, start the next track when this one ends.
						if (independentTracks) {
							currentIndependentTrackIndex++;
							if (currentIndependentTrackIndex < tracks.length) {
								currentTrackIndices[0] = currentIndependentTrackIndex;
								tracks[currentIndependentTrackIndex].nextEventMidiTick += currentMidiTick;
								nextEventMidiTick = Math.min(nextEventMidiTick, tracks[currentIndependentTrackIndex].nextEventMidiTick);
								anyTrackHasMore = true;
							}
						}
					}
				}
					
				if (!track.ended) {
					anyTrackHasMore = true;
					nextEventMidiTick = Math.min(nextEventMidiTick, track.nextEventMidiTick);
				}
			}
				
			if (anyTrackHasMore) {
				currentMidiTick = nextEventMidiTick;
			} else {
				break;
			}
		}
			
		// Now the MIDI file is fully parsed. Next, constuct BeepBox channels out of the data.
		const microsecondsPerMinute: number = 60 * 1000 * 1000;
		const beatsPerMinute: number = Math.max(Config.tempoMin, Math.min(Config.tempoMax, Math.round(microsecondsPerMinute / microsecondsPerBeat)));
		const midiTicksPerPart: number = midiTicksPerBeat / Config.partsPerBeat;
		const partsPerBar: number = Config.partsPerBeat * beatsPerBar;
		const songTotalBars: number = Math.ceil(currentMidiTick / midiTicksPerPart / partsPerBar);
			
		function quantizeMidiTickToPart(midiTick: number): number {
			return Math.round(midiTick / midiTicksPerPart);
		}

		let key: number = numSharps;
		if (isMinor) key += 3; // Diatonic C Major has the same sharps/flats as A Minor, and these keys are 3 semitones apart.
		if ((key & 1) == 1) key += 6; // If the number of sharps/flats is odd, rotate it halfway around the circle of fifths. The key of C# has little in common with the key of C.
		while (key < 0) key += 12; // Wrap around to a range from 0 to 11.
		key = key % 12; // Wrap around to a range from 0 to 11.
			
		// Convert each midi channel into a BeepBox channel.
		const pitchChannels: Channel[] = [];
		const noiseChannels: Channel[] = [];
		const modChannels: Channel[] = [];
		for (let midiChannel: number = 0; midiChannel < 16; midiChannel++) {
			if (noteEvents[midiChannel].length == 0) continue;
				
			const channel: Channel = new Channel();
				
			const channelPresetValue: number | null = EditorConfig.midiProgramToPresetValue(noteEvents[midiChannel][0].program);
			const channelPreset: Preset | null = (channelPresetValue == null) ? null : EditorConfig.valueToPreset(channelPresetValue);
				
			const isDrumsetChannel: boolean = (midiChannel == 9);
			const isNoiseChannel: boolean = isDrumsetChannel || (channelPreset != null && channelPreset.isNoise == true);
			const isModChannel: boolean = (channelPreset != null && channelPreset.isMod == true);
			const channelBasePitch: number = isNoiseChannel ? Config.spectrumBasePitch : Config.keys[key].basePitch;
			const intervalScale: number = isNoiseChannel ? Config.noiseInterval : 1;
			const midiIntervalScale: number = isNoiseChannel ? 0.5 : 1;
			const channelMaxPitch: number = isNoiseChannel ? Config.drumCount - 1 : Config.maxPitch;
				
			if (isNoiseChannel) {
				if (isDrumsetChannel) {
					noiseChannels.unshift(channel);
				} else {
					noiseChannels.push(channel);
				}
			} else if (isModChannel) {
				modChannels.push(channel);
			} else {
				pitchChannels.push(channel);
			}
				
			let currentVelocity: number = 1.0;
			let currentProgram: number = 0;
			let currentInstrumentVolume: number = 0;
			let currentInstrumentPan: number = Config.panCenter;
				
			if (isDrumsetChannel) {
				const heldPitches: number[] = [];
				let currentBar: number = -1;
				let pattern: Pattern | null = null;
				let prevEventPart: number = 0;
				let setInstrumentVolume: boolean = false;
					
				const presetValue: number = EditorConfig.nameToPresetValue("standard drumset")!;
				const preset: Preset = EditorConfig.valueToPreset(presetValue)!;
				const instrument: Instrument = new Instrument(false, false);
					instrument.fromJsonObject(preset.settings, false, false, false, false, 1);
					
				instrument.preset = presetValue;
				channel.instruments.push(instrument);

				for (let noteEventIndex: number = 0; noteEventIndex <= noteEvents[midiChannel].length; noteEventIndex++) {
					const noMoreNotes: boolean = noteEventIndex == noteEvents[midiChannel].length;
					const noteEvent: NoteEvent | null = noMoreNotes ? null : noteEvents[midiChannel][noteEventIndex];
					const nextEventPart: number = noteEvent == null ? Number.MAX_SAFE_INTEGER : quantizeMidiTickToPart(noteEvent.midiTick);
					if (heldPitches.length > 0 && nextEventPart > prevEventPart && (noteEvent == null || noteEvent.on)) {
						const bar: number = Math.floor(prevEventPart / partsPerBar);
						const barStartPart: number = bar * partsPerBar;
						// Ensure a pattern exists for the current bar before inserting notes into it.
						if (currentBar != bar || pattern == null) {
							currentBar++;
							while (currentBar < bar) {
								channel.bars[currentBar] = 0;
								currentBar++;
							}
							pattern = new Pattern();
							channel.patterns.push(pattern);
							channel.bars[currentBar] = channel.patterns.length;
							pattern.instruments[0] = 0;
							pattern.instruments.length = 1;
						}
							
						// Use the loudest volume setting for the instrument, since 
						// many midis unfortunately use the instrument volume control to fade
						// in at the beginning and we don't want to get stuck with the initial
						// zero volume.
						if (!setInstrumentVolume || instrument.volume > currentInstrumentVolume) {
							instrument.volume = currentInstrumentVolume;
							instrument.pan = currentInstrumentPan;
							instrument.panDelay = 0;
							setInstrumentVolume = true;
						}
						
						const drumFreqs: number[] = [];
						let minDuration: number = channelMaxPitch;
						let maxDuration: number = 0;
						let noteSize: number = 1; // the minimum non-zero note size.
						for (const pitch of heldPitches) {
							const drum: AnalogousDrum | undefined = analogousDrumMap[pitch];
							if (drumFreqs.indexOf(drum.frequency) == -1) {
								drumFreqs.push(drum.frequency);
							}
							noteSize = Math.max(noteSize, Math.round(drum.volume * currentVelocity));
							minDuration = Math.min(minDuration, drum.duration);
							maxDuration = Math.max(maxDuration, drum.duration);
						}
						const duration: number = Math.min(maxDuration, Math.max(minDuration, 2));
						const noteStartPart: number = prevEventPart - barStartPart;
						const noteEndPart: number = Math.min(partsPerBar, Math.min(nextEventPart - barStartPart, noteStartPart + duration * 6));
							
						const note: Note = new Note(-1, noteStartPart, noteEndPart, noteSize, true);
							
						note.pitches.length = 0;
						for (let pitchIndex: number = 0; pitchIndex < Math.min(Config.maxChordSize, drumFreqs.length); pitchIndex++) {
							const heldPitch: number = drumFreqs[pitchIndex + Math.max(0, drumFreqs.length - Config.maxChordSize)];
							if (note.pitches.indexOf(heldPitch) == -1) {
								note.pitches.push(heldPitch);
							}
						}
						pattern.notes.push(note);
							
						heldPitches.length = 0;
					}
						
					// Process the next midi note event before continuing, updating the list of currently held pitches.
					if (noteEvent != null && noteEvent.on && analogousDrumMap[noteEvent.pitch] != undefined) {
						heldPitches.push(noteEvent.pitch);
						prevEventPart = nextEventPart;
						currentVelocity = noteEvent.velocity;
						currentInstrumentVolume = noteEvent.instrumentVolume;
						currentInstrumentPan = noteEvent.instrumentPan;
					}
				}
			} else {
				// If not a drumset, handle as a tonal instrument.
					
				// Advance the pitch bend and note size timelines to the given midiTick, 
				// changing the value of currentMidiInterval or currentMidiNoteSize.
				// IMPORTANT: These functions can't rewind!
				let currentMidiInterval: number = 0.0;
				let currentMidiNoteSize: number = Config.noteSizeMax;
				let pitchBendEventIndex: number = 0;
				let noteSizeEventIndex: number = 0;
				function updateCurrentMidiInterval(midiTick: number) {
					while (pitchBendEventIndex < pitchBendEvents[midiChannel].length && pitchBendEvents[midiChannel][pitchBendEventIndex].midiTick <= midiTick) {
						currentMidiInterval = pitchBendEvents[midiChannel][pitchBendEventIndex].interval;
						pitchBendEventIndex++;
					}
				}
				function updateCurrentMidiNoteSize(midiTick: number) {
					while (noteSizeEventIndex < noteSizeEvents[midiChannel].length && noteSizeEvents[midiChannel][noteSizeEventIndex].midiTick <= midiTick) {
						currentMidiNoteSize = noteSizeEvents[midiChannel][noteSizeEventIndex].size;
						noteSizeEventIndex++;
					}
				}
					
				const instrumentByProgram: Instrument[] = [];
				const heldPitches: number[] = [];
				let currentBar: number = -1;
				let pattern: Pattern | null = null;
				let prevEventMidiTick: number = 0;
				let prevEventPart: number = 0;
				let pitchSum: number = 0;
				let pitchCount: number = 0;
					
				for (let noteEvent of noteEvents[midiChannel]) {
					const nextEventMidiTick: number = noteEvent.midiTick;
					const nextEventPart: number = quantizeMidiTickToPart(nextEventMidiTick);
						
					if (heldPitches.length > 0 && nextEventPart > prevEventPart) {
						// If there are any pitches held between the previous event and the next
						// event, iterate over all bars covered by this time period, ensure they
						// have a pattern instantiated, and insert notes for these pitches.
						const startBar: number = Math.floor(prevEventPart / partsPerBar);
						const endBar: number = Math.ceil(nextEventPart / partsPerBar);
						let createdNote: boolean = false;
						for (let bar: number = startBar; bar < endBar; bar++) {
							const barStartPart: number = bar * partsPerBar;
							const barStartMidiTick: number = bar * beatsPerBar * midiTicksPerBeat;
							const barEndMidiTick: number = (bar + 1) * beatsPerBar * midiTicksPerBeat;
								
							const noteStartPart: number = Math.max(0, prevEventPart - barStartPart);
							const noteEndPart: number = Math.min(partsPerBar, nextEventPart - barStartPart);
							const noteStartMidiTick: number = Math.max(barStartMidiTick, prevEventMidiTick);
							const noteEndMidiTick: number = Math.min(barEndMidiTick, nextEventMidiTick);
								
							if (noteStartPart < noteEndPart) {
								const presetValue: number | null = EditorConfig.midiProgramToPresetValue(currentProgram);
								const preset: Preset | null = (presetValue == null) ? null : EditorConfig.valueToPreset(presetValue);
									
								// Ensure a pattern exists for the current bar before inserting notes into it.
								if (currentBar != bar || pattern == null) {
									currentBar++;
									while (currentBar < bar) {
										channel.bars[currentBar] = 0;
										currentBar++;
									}
									pattern = new Pattern();
									channel.patterns.push(pattern);
									channel.bars[currentBar] = channel.patterns.length;
										
									// If this is the first time a note is trying to use a specific instrument
									// program in this channel, create a new BeepBox instrument for it.
									if (instrumentByProgram[currentProgram] == undefined) {
										const instrument: Instrument = new Instrument(isNoiseChannel, isModChannel);
										instrumentByProgram[currentProgram] = instrument;
											
										if (presetValue != null && preset != null && (preset.isNoise == true) == isNoiseChannel) {
												instrument.fromJsonObject(preset.settings, isNoiseChannel, isModChannel, false, false, 1);
											instrument.preset = presetValue;
										} else {
											instrument.setTypeAndReset(isModChannel ? InstrumentType.mod : (isNoiseChannel ? InstrumentType.noise : InstrumentType.chip), isNoiseChannel, isModChannel);
											instrument.chord = 0; // Midi instruments use polyphonic harmony by default.
										}
											
										instrument.volume = currentInstrumentVolume;
										instrument.pan = currentInstrumentPan;
										instrument.panDelay = 0;

										channel.instruments.push(instrument);
									}
										
									pattern.instruments[0] = channel.instruments.indexOf(instrumentByProgram[currentProgram]);
									pattern.instruments.length = 1;
								}
									
								// Use the loudest volume setting for the instrument, since 
								// many midis unfortunately use the instrument volume control to fade
								// in at the beginning and we don't want to get stuck with the initial
								// zero volume.
								if (instrumentByProgram[currentProgram] != undefined) {
									instrumentByProgram[currentProgram].volume = Math.min(instrumentByProgram[currentProgram].volume, currentInstrumentVolume);
									instrumentByProgram[currentProgram].pan = Math.min(instrumentByProgram[currentProgram].pan, currentInstrumentPan);
								}
									
								// Create a new note, and interpret the pitch bend and note size events
								// to determine where we need to insert pins to control interval and size.
								const note: Note = new Note(-1, noteStartPart, noteEndPart, Config.noteSizeMax, false);
								note.pins.length = 0;
								note.continuesLastPattern = (createdNote && noteStartPart == 0);
								createdNote = true;
									
								updateCurrentMidiInterval(noteStartMidiTick);
								updateCurrentMidiNoteSize(noteStartMidiTick);
								const shiftedHeldPitch: number = heldPitches[0] * midiIntervalScale - channelBasePitch;
								const initialBeepBoxPitch: number = Math.round((shiftedHeldPitch + currentMidiInterval) / intervalScale);
								const heldPitchOffset: number = Math.round(currentMidiInterval - channelBasePitch);
								let firstPin: NotePin = makeNotePin(0, 0, Math.round(currentVelocity * currentMidiNoteSize));
								note.pins.push(firstPin);
									
								interface PotentialPin {
									part: number;
									pitch: number;
									size: number;
									keyPitch: boolean;
									keySize: boolean;
								}
								const potentialPins: PotentialPin[] = [
									{part: 0, pitch: initialBeepBoxPitch, size: firstPin.size, keyPitch: false, keySize: false}
								];
								let prevPinIndex: number = 0;
									
								let prevPartPitch: number = (shiftedHeldPitch + currentMidiInterval) / intervalScale;
								let prevPartSize: number = currentVelocity * currentMidiNoteSize;
								for (let part: number = noteStartPart + 1; part <= noteEndPart; part++) {
									const midiTick: number = Math.max(noteStartMidiTick, Math.min(noteEndMidiTick - 1, Math.round(midiTicksPerPart * (part + barStartPart))));
									const noteRelativePart: number = part - noteStartPart;
									const lastPart: boolean = (part == noteEndPart);
										
									// BeepBox can only add pins at whole number intervals and sizes. Detect places where
									// the interval or size are at or cross whole numbers, and add these to the list of
									// potential places to insert pins.
									updateCurrentMidiInterval(midiTick);
									updateCurrentMidiNoteSize(midiTick);
									const partPitch: number = (currentMidiInterval + shiftedHeldPitch) / intervalScale;
									const partSize: number = currentVelocity * currentMidiNoteSize;
										
									const nearestPitch: number = Math.round(partPitch);
									const pitchIsNearInteger: boolean = Math.abs(partPitch - nearestPitch) < 0.01;
									const pitchCrossedInteger: boolean = (Math.abs(prevPartPitch - Math.round(prevPartPitch)) < 0.01)
										? Math.abs(partPitch - prevPartPitch) >= 1.0
										: Math.floor(partPitch) != Math.floor(prevPartPitch);
									const keyPitch: boolean = pitchIsNearInteger || pitchCrossedInteger;
										
									const nearestSize: number = Math.round(partSize);
									const sizeIsNearInteger: boolean = Math.abs(partSize - nearestSize) < 0.01;
									const sizeCrossedInteger: boolean = (Math.abs(prevPartSize - Math.round(prevPartSize)))
										? Math.abs(partSize - prevPartSize) >= 1.0
										: Math.floor(partSize) != Math.floor(prevPartSize);
									const keySize: boolean = sizeIsNearInteger || sizeCrossedInteger;
										
									prevPartPitch = partPitch;
									prevPartSize = partSize;
										
									if (keyPitch || keySize || lastPart) {
										const currentPin: PotentialPin = {part: noteRelativePart, pitch: nearestPitch, size: nearestSize, keyPitch: keyPitch || lastPart, keySize: keySize || lastPart};
										const prevPin: PotentialPin = potentialPins[prevPinIndex];
											
										// At all key points in the list of potential pins, check to see if they
										// continue the recent slope. If not, insert a pin at the corner, where
										// the recent recorded values deviate the furthest from the slope.
										let addPin: boolean = false;
										let addPinAtIndex: number = Number.MAX_VALUE;
											
										if (currentPin.keyPitch) {
											const slope: number = (currentPin.pitch - prevPin.pitch) / (currentPin.part - prevPin.part);
											let furthestIntervalDistance: number = Math.abs(slope); // minimum distance to make a new pin.
											let addIntervalPin: boolean = false;
											let addIntervalPinAtIndex: number = Number.MAX_VALUE;
											for (let potentialIndex: number = prevPinIndex + 1; potentialIndex < potentialPins.length; potentialIndex++) {
												const potentialPin: PotentialPin = potentialPins[potentialIndex];
												if (potentialPin.keyPitch) {
													const interpolatedInterval: number = prevPin.pitch + slope * (potentialPin.part - prevPin.part);
													const distance: number = Math.abs(interpolatedInterval - potentialPin.pitch);
													if (furthestIntervalDistance < distance) {
														furthestIntervalDistance = distance;
														addIntervalPin = true;
														addIntervalPinAtIndex = potentialIndex;
													}
												}
											}
											if (addIntervalPin) {
												addPin = true;
												addPinAtIndex = Math.min(addPinAtIndex, addIntervalPinAtIndex);
											}
										}
											
										if (currentPin.keySize) {
											const slope: number = (currentPin.size - prevPin.size) / (currentPin.part - prevPin.part);
											let furthestSizeDistance: number = Math.abs(slope); // minimum distance to make a new pin.
											let addSizePin: boolean = false;
											let addSizePinAtIndex: number = Number.MAX_VALUE;
											for (let potentialIndex: number = prevPinIndex + 1; potentialIndex < potentialPins.length; potentialIndex++) {
												const potentialPin: PotentialPin = potentialPins[potentialIndex];
												if (potentialPin.keySize) {
													const interpolatedSize: number = prevPin.size + slope * (potentialPin.part - prevPin.part);
													const distance: number = Math.abs(interpolatedSize - potentialPin.size);
													if (furthestSizeDistance < distance) {
														furthestSizeDistance = distance;
														addSizePin = true;
														addSizePinAtIndex = potentialIndex;
													}
												}
											}
											if (addSizePin) {
												addPin = true;
												addPinAtIndex = Math.min(addPinAtIndex, addSizePinAtIndex);
											}
										}
											
										if (addPin) {
											const toBePinned: PotentialPin = potentialPins[addPinAtIndex];
											note.pins.push(makeNotePin(toBePinned.pitch - initialBeepBoxPitch, toBePinned.part, toBePinned.size));
											prevPinIndex = addPinAtIndex;
										}
											
										potentialPins.push(currentPin);
									}
								}
									
								// And always add a pin at the end of the note.
								const lastToBePinned: PotentialPin = potentialPins[potentialPins.length - 1];
								note.pins.push(makeNotePin(lastToBePinned.pitch - initialBeepBoxPitch, lastToBePinned.part, lastToBePinned.size));
									
								// Use interval range to constrain min/max pitches so no pin is out of bounds.
								let maxPitch: number = channelMaxPitch;
								let minPitch: number = 0;
								for (const notePin of note.pins) {
									maxPitch = Math.min(maxPitch, channelMaxPitch - notePin.interval);
									minPitch = Math.min(minPitch, -notePin.interval);
								}
									
								// Build the note chord out of the current pitches, shifted into BeepBox channelBasePitch relative values.
								note.pitches.length = 0;
								for (let pitchIndex: number = 0; pitchIndex < Math.min(Config.maxChordSize, heldPitches.length); pitchIndex++) {
									let heldPitch: number = heldPitches[pitchIndex + Math.max(0, heldPitches.length - Config.maxChordSize)] * midiIntervalScale;
									if (preset != null && preset.midiSubharmonicOctaves != undefined) {
										heldPitch -= 12 * preset.midiSubharmonicOctaves;
									}
									const shiftedPitch: number = Math.max(minPitch, Math.min(maxPitch, Math.round((heldPitch + heldPitchOffset) / intervalScale)));
									if (note.pitches.indexOf(shiftedPitch) == -1) {
										note.pitches.push(shiftedPitch);
										const weight: number = note.end - note.start;
										pitchSum += shiftedPitch * weight;
										pitchCount += weight;
									}
								}
								pattern.notes.push(note);
							}
						}
					}
						
					// Process the next midi note event before continuing, updating the list of currently held pitches.
					if (heldPitches.indexOf(noteEvent.pitch) != -1) {
						heldPitches.splice(heldPitches.indexOf(noteEvent.pitch), 1);
					}
					if (noteEvent.on) {
						heldPitches.push(noteEvent.pitch);
						currentVelocity = noteEvent.velocity;
						currentProgram = noteEvent.program;
						currentInstrumentVolume = noteEvent.instrumentVolume;
						currentInstrumentPan = noteEvent.instrumentPan;
					}
						
					prevEventMidiTick = nextEventMidiTick;
					prevEventPart = nextEventPart;
				}
					
				const averagePitch: number = pitchSum / pitchCount;
					channel.octave = (isNoiseChannel || isModChannel) ? 0 : Math.max(0, Math.min(Config.pitchOctaves - 1, Math.floor((averagePitch / 12))));
			}
					
			while (channel.bars.length < songTotalBars) {
				channel.bars.push(0);
			}
		}
			
		// For better or for worse, BeepBox has a more limited number of channels than Midi.
		// To compensate, try to merge non-overlapping channels.
		function compactChannels(channels: Channel[], maxLength: number): void {
			while (channels.length > maxLength) {
				let bestChannelIndexA: number = channels.length - 2;
				let bestChannelIndexB: number = channels.length - 1;
				let fewestConflicts: number = Number.MAX_VALUE;
				let fewestGaps: number = Number.MAX_VALUE;
				for (let channelIndexA: number = 0; channelIndexA < channels.length - 1; channelIndexA++) {
					for (let channelIndexB: number = channelIndexA + 1; channelIndexB < channels.length; channelIndexB++) {
						const channelA: Channel = channels[channelIndexA];
						const channelB: Channel = channels[channelIndexB];
						let conflicts: number = 0;
						let gaps: number = 0;
						for (let barIndex: number = 0; barIndex < channelA.bars.length && barIndex < channelB.bars.length; barIndex++) {
							if (channelA.bars[barIndex] != 0 && channelB.bars[barIndex] != 0) conflicts++;
							if (channelA.bars[barIndex] == 0 && channelB.bars[barIndex] == 0) gaps++;
						}
						if (conflicts <= fewestConflicts) {
							if (conflicts < fewestConflicts || gaps < fewestGaps) {
								bestChannelIndexA = channelIndexA;
								bestChannelIndexB = channelIndexB;
								fewestConflicts = conflicts;
								fewestGaps = gaps;
							}
						}
					}
				}
					
				// Merge channelB's patterns, instruments, and bars into channelA.
				const channelA: Channel = channels[bestChannelIndexA];
				const channelB: Channel = channels[bestChannelIndexB];
				const channelAInstrumentCount: number = channelA.instruments.length;
				const channelAPatternCount: number = channelA.patterns.length;
				for (const instrument of channelB.instruments) {
					channelA.instruments.push(instrument);
				}
				for (const pattern of channelB.patterns) {
					pattern.instruments[0] += channelAInstrumentCount;
					channelA.patterns.push(pattern);
				}
				for (let barIndex: number = 0; barIndex < channelA.bars.length && barIndex < channelB.bars.length; barIndex++) {
					if (channelA.bars[barIndex] == 0 && channelB.bars[barIndex] != 0) {
						channelA.bars[barIndex] = channelB.bars[barIndex] + channelAPatternCount;
					}
				}
					
				// Remove channelB.
				channels.splice(bestChannelIndexB, 1);
			}
		}
			
		compactChannels(pitchChannels, Config.pitchChannelCountMax);
		compactChannels(noiseChannels, Config.noiseChannelCountMax);
		compactChannels(modChannels, Config.modChannelCountMax);
			
		class ChangeImportMidi extends ChangeGroup {
			constructor(doc: SongDocument) {
				super();
				const song: Song = doc.song;
				song.tempo = beatsPerMinute;
				song.beatsPerBar = beatsPerBar;
				song.key = key;
				song.scale = 11;
				song.rhythm = 1;
				song.layeredInstruments = false;
				song.patternInstruments = pitchChannels.some(channel => channel.instruments.length > 1) || noiseChannels.some(channel => channel.instruments.length > 1);
					
				removeDuplicatePatterns(pitchChannels);
				removeDuplicatePatterns(noiseChannels);
				removeDuplicatePatterns(modChannels);
					
				this.append(new ChangeReplacePatterns(doc, pitchChannels, noiseChannels, modChannels));
				song.loopStart = 0;
				song.loopLength = song.barCount;
				this._didSomething();
				doc.notifier.changed();
			}
		}
		this.goBackToStart();
		for (const channel of this.song.channels) channel.muted = false;
		this.prompt = null;
		this.record(new ChangeImportMidi(this), true, true);
	}
	
	public toggleDisplayBrowserUrl() {
		const state: HistoryState = this._getHistoryState()!;
		this.prefs.displayBrowserUrl = false;
		this._replaceState(state, this.song.toBase64String());
	}
		
	private _getHistoryState(): HistoryState | null {
		if (this.prefs.displayBrowserUrl) {
			return window.history.state;
		} else {
			const json: any = JSON.parse(window.sessionStorage.getItem(window.sessionStorage.getItem("currentUndoIndex")!)!);
			return json == null ? null : json.state;
		}
	}
		
	private _getHash(): string {
		if (this.prefs.displayBrowserUrl) {
			return window.location.hash;
		} else {
			const json: any = JSON.parse(window.sessionStorage.getItem(window.sessionStorage.getItem("currentUndoIndex")!)!);
			return json == null ? "" : json.hash;
		}
	}
		
	private _replaceState(state: HistoryState, hash: string): void {
		if (this.prefs.displayBrowserUrl) {
			// window.history.replaceState(state, "", "#" + hash);
		} else {
			// window.sessionStorage.setItem(window.sessionStorage.getItem("currentUndoIndex") || "0", JSON.stringify({state, hash}));
			// window.history.replaceState(null, "", location.pathname);
		}
	}
		
	private _pushState(state: HistoryState, hash: string): void {
		if (this.prefs.displayBrowserUrl) {
			// window.history.pushState(state, "", "#" + hash);
		} else {
			let currentIndex: number = Number(window.sessionStorage.getItem("currentUndoIndex"));
			let oldestIndex: number = Number(window.sessionStorage.getItem("oldestUndoIndex"));
			currentIndex = (currentIndex + 1) % SongDocument._maximumUndoHistory;
			window.sessionStorage.setItem("currentUndoIndex", String(currentIndex));
			window.sessionStorage.setItem("newestUndoIndex", String(currentIndex));
			if (currentIndex == oldestIndex) {
				oldestIndex = (oldestIndex + 1) % SongDocument._maximumUndoHistory;
				window.sessionStorage.setItem("oldestUndoIndex", String(oldestIndex));
			}
				window.sessionStorage.setItem(String(currentIndex), JSON.stringify({state, hash}));
			// window.history.replaceState(null, "", location.pathname);
		}
		this._lastSequenceNumber = state.sequenceNumber;
	}

	public hasRedoHistory(): boolean {
		return this._lastSequenceNumber > this._sequenceNumber;
	}	
		
	private _forward(): void {
		if (this.prefs.displayBrowserUrl) {
			// window.history.forward();
		} else {
			let currentIndex: number = Number(window.sessionStorage.getItem("currentUndoIndex"));
			let newestIndex: number = Number(window.sessionStorage.getItem("newestUndoIndex"));
			if (currentIndex != newestIndex) {
				currentIndex = (currentIndex + 1) % SongDocument._maximumUndoHistory;
				window.sessionStorage.setItem("currentUndoIndex", String(currentIndex));
				setTimeout(this._whenHistoryStateChanged);
			}
		}
	}
		
	private _back(): void {
		if (this.prefs.displayBrowserUrl) {
			// window.history.back();
		} else {
			let currentIndex: number = Number(window.sessionStorage.getItem("currentUndoIndex"));
			let oldestIndex: number = Number(window.sessionStorage.getItem("oldestUndoIndex"));
			if (currentIndex != oldestIndex) {
				currentIndex = (currentIndex + SongDocument._maximumUndoHistory - 1) % SongDocument._maximumUndoHistory;
				window.sessionStorage.setItem("currentUndoIndex", String(currentIndex));
				setTimeout(this._whenHistoryStateChanged);
			}
		}
	}
		
	private _whenHistoryStateChanged = (): void => {
		if (this.synth.recording) {
			// Changes to the song while it's recording to could mess up the recording so just abort the recording.
			this.performance.abortRecording();
		}
		
		if (window.history.state == null && window.location.hash != "") {
			// The user changed the hash directly.
			this._sequenceNumber++;
			this._resetSongRecoveryUid();
			const state: HistoryState = {canUndo: true, sequenceNumber: this._sequenceNumber, bar: this.bar, channel: this.channel, instrument: this.viewedInstrument[this.channel], recoveryUid: this._recoveryUid, prompt: null, selection: this.selection.toJSON()};
			new ChangeSong(this, window.location.hash);
			this.prompt = state.prompt;
			if (this.prefs.displayBrowserUrl) {
				this._replaceState(state, this.song.toBase64String());
			} else {
				this._pushState(state, this.song.toBase64String());
			}
			this.forgetLastChange();
			this.notifier.notifyWatchers();
			// Stop playing, and go to start when pasting new song in.
			this.synth.pause();
			this.synth.goToBar(0);
			return;
		}
			
		const state: HistoryState | null = this._getHistoryState();
		if (state == null) throw new Error("History state is null.");
			
		// Abort if we've already handled the current state. 
		if (state.sequenceNumber == this._sequenceNumber) return;
			
		this.bar = state.bar;
		this.channel = state.channel;
		this.viewedInstrument[this.channel] = state.instrument;
		this._sequenceNumber = state.sequenceNumber;
		this.prompt = state.prompt;
		new ChangeSong(this, this._getHash());
			
		this._recoveryUid = state.recoveryUid;
		this.selection.fromJSON(state.selection);
			
		//this.barScrollPos = Math.min(this.bar, Math.max(this.bar - (this.trackVisibleBars - 1), this.barScrollPos));
			
		this.forgetLastChange();
		this.notifier.notifyWatchers();
	}
		
	private _cleanDocument = (): void => {
		this.notifier.notifyWatchers();
	}
	
	private _validateDocState = (): void => {
		const channelCount: number = this.song.getChannelCount();
		for (let i: number = this.recentPatternInstruments.length; i < channelCount; i++) {
			this.recentPatternInstruments[i] = [0];
	}
		this.recentPatternInstruments.length = channelCount;
		for (let i: number = 0; i < channelCount; i++) {
			if (i == this.channel) {
				if (this.song.patternInstruments) {
					const pattern: Pattern | null = this.song.getPattern(this.channel, this.bar);
					if (pattern != null) {
						this.recentPatternInstruments[i] = pattern.instruments.concat();
					}
				} else {
					const channel: Channel = this.song.channels[this.channel];
					for (let j: number = 0; j < channel.instruments.length; j++) {
						this.recentPatternInstruments[i][j] = j;
					}
					this.recentPatternInstruments[i].length = channel.instruments.length;
				}
			}
			discardInvalidPatternInstruments(this.recentPatternInstruments[i], this.song, i);
		}

		for (let i: number = this.viewedInstrument.length; i < channelCount; i++) {
			this.viewedInstrument[i] = 0;
		}
		this.viewedInstrument.length = channelCount;
		for (let i: number = 0; i < channelCount; i++) {
			if (this.song.patternInstruments && !this.song.layeredInstruments && i == this.channel) {
				const pattern: Pattern | null = this.song.getPattern(this.channel, this.bar);
				if (pattern != null) {
					this.viewedInstrument[i] = pattern.instruments[0];
				}
			}
			this.viewedInstrument[i] = Math.min(this.viewedInstrument[i] | 0, this.song.channels[i].instruments.length - 1);
		}
		
		const highlightedPattern: Pattern | null = this.getCurrentPattern();
		if (highlightedPattern != null && this.song.patternInstruments) {
			this.recentPatternInstruments[this.channel] = highlightedPattern.instruments.concat();
		}
		
		// Normalize selection.
		// I'm allowing the doc.bar to drift outside the box selection while playing
		// because it may auto-follow the playhead outside the selection but it would
		// be annoying to lose your selection just because the song is playing.
		if ((!this.synth.playing && (this.bar < this.selection.boxSelectionBar || this.selection.boxSelectionBar + this.selection.boxSelectionWidth <= this.bar)) ||
			this.channel < this.selection.boxSelectionChannel ||
			this.selection.boxSelectionChannel + this.selection.boxSelectionHeight <= this.channel ||
			this.song.barCount < this.selection.boxSelectionBar + this.selection.boxSelectionWidth ||
			channelCount < this.selection.boxSelectionChannel + this.selection.boxSelectionHeight ||
			(this.selection.boxSelectionWidth == 1 && this.selection.boxSelectionHeight == 1)) {
			this.selection.resetBoxSelection();
		}
	}
		
	private _updateHistoryState = (): void => {
		this._waitingToUpdateState = false;
		let hash: string;
		try {
			// Ensure that the song is not corrupted before saving it.
			hash = this.song.toBase64String();
		} catch (error) {
			window.alert("Whoops, the song data appears to have been corrupted! Please try to recover the last working version of the song from the \"Recover Recent Song...\" option in BeepBox's \"File\" menu.");
			return;
		}
		if (this._stateShouldBePushed) this._sequenceNumber++;
		if (this._recordedNewSong) {
			this._resetSongRecoveryUid();
		} else {
			this._recovery.saveVersion(this._recoveryUid, this.song.title, hash);
		}
		let state: HistoryState = {canUndo: true, sequenceNumber: this._sequenceNumber, bar: this.bar, channel: this.channel, instrument: this.viewedInstrument[this.channel], recoveryUid: this._recoveryUid, prompt: this.prompt, selection: this.selection.toJSON()};
		if (this._stateShouldBePushed) {
			this._pushState(state, hash);
		} else {
			this._replaceState(state, hash);
		}
		this._stateShouldBePushed = false;
		this._recordedNewSong = false;
	}
		
	public record(change: Change, replace: boolean = false, newSong: boolean = false): void {
		if (change.isNoop()) {
			this._recentChange = null;
			if (replace) this._back();
		} else {
			change.commit();
			this._recentChange = change;
			this._stateShouldBePushed = this._stateShouldBePushed || !replace;
			this._recordedNewSong = this._recordedNewSong || newSong;
			if (!this._waitingToUpdateState) {
				// Defer updating the url/history until all sequenced changes have
				// committed and the interface has rendered the latest changes to
				// improve perceived responsiveness.
				window.requestAnimationFrame(this._updateHistoryState);
				this._waitingToUpdateState = true;
			}
		}
	}
		
	private _resetSongRecoveryUid(): void {
		this._recoveryUid = generateUid();
	}
		
	public openPrompt(prompt: string): void {
		this.prompt = prompt;
		const hash: string = this.song.toBase64String();
		this._sequenceNumber++;
		const state = {canUndo: true, sequenceNumber: this._sequenceNumber, bar: this.bar, channel: this.channel, instrument: this.viewedInstrument[this.channel], recoveryUid: this._recoveryUid, prompt: this.prompt, selection: this.selection.toJSON()};
		this._pushState(state, hash);
	}
		
	public undo(): void {
		const state: HistoryState = this._getHistoryState()!;
		if (state.canUndo) this._back();
	}
		
	public redo(): void {
		this._forward();
	}
		
	public setProspectiveChange(change: Change | null): void {
		this._recentChange = change;
	}
		
	public forgetLastChange(): void {
		this._recentChange = null;
	}
		
	public lastChangeWas(change: Change | null): boolean {
		return change != null && change == this._recentChange;
	}
		
	public goBackToStart(): void {
		this.bar = 0;
		this.channel = 0;
		this.barScrollPos = 0;
		this.channelScrollPos = 0;
		this.synth.snapToStart();
		this.notifier.changed();
	}
	
	public setVolume(val: number): void {
		this.prefs.volume = val;
		this.prefs.save();
		this.synth.volume = this._calcVolume();
	}
		
	private _calcVolume(): number {
		return Math.min(1.0, Math.pow(this.prefs.volume / 50.0, 0.5)) * Math.pow(2.0, (this.prefs.volume - 75.0) / 25.0);
	}
		
	public getCurrentPattern(barOffset: number = 0): Pattern | null {
		return this.song.getPattern(this.channel, this.bar + barOffset);
	}
		
	public getCurrentInstrument(barOffset: number = 0): number {
		if (barOffset == 0) {
			return this.viewedInstrument[this.channel];
		} else {
			const pattern: Pattern | null = this.getCurrentPattern(barOffset);
			return pattern == null ? 0 : pattern.instruments[0];
        }
	}
		
	public getMobileLayout(): boolean {
		return (this.prefs.layout == "wide") ? window.innerWidth <= 1000 : window.innerWidth <= 710;
	}
		
	public getBarWidth(): number {
		// Bugfix: In wide fullscreen, the 32 pixel display doesn't work as the trackEditor is still horizontally constrained
		return (!this.getMobileLayout() && this.prefs.enableChannelMuting && (!this.getFullScreen() || this.prefs.layout == "wide")) ? 30 : 32;
	}
		
	public getChannelHeight(): number {
		const squashed: boolean = this.getMobileLayout() || this.song.getChannelCount() > 4 || (this.song.barCount > this.trackVisibleBars && this.song.getChannelCount() > 3);
		// TODO: Jummbox widescreen should allow more channels before squashing or megasquashing
		const megaSquashed: boolean = !this.getMobileLayout() && (((this.prefs.layout != "wide") && this.song.getChannelCount() > 11) || this.song.getChannelCount() > 22);
		return megaSquashed ? 23 : (squashed ? 27 : 32);
	}
		
	public getFullScreen(): boolean {
		return !this.getMobileLayout() && (this.prefs.layout != "small");
	}
	
	public getVisibleOctaveCount(): number {
		return this.getFullScreen() ? this.prefs.visibleOctaves : Preferences.defaultVisibleOctaves;
}
	
	public getVisiblePitchCount(): number {
		 return this.getVisibleOctaveCount() * Config.pitchesPerOctave + 1;
	}
	
	public getBaseVisibleOctave(channel: number): number {
		const visibleOctaveCount: number = this.getVisibleOctaveCount();
		return Math.max(0, Math.min(Config.pitchOctaves - visibleOctaveCount, Math.ceil(this.song.channels[channel].octave - visibleOctaveCount * 0.5)));
	}
}
