
export var submitted_sample;

// Editor helper elements
const MIDI_INJECTOR = "injectMIDI"
const MIDI_FILE_INPUT = "midi_file_input"
const PAUSE_PLAYER_ELEMENT = "pausePlayer"

// Events
const INSERT_MIDI_EVENT = "inject_MIDI"
const DISABLE_EDITOR_EVENT = "deactivateEditor"
const CLEAR_EDITOR_TRACK_EVENT = "clear_track"
const FETCH_MIDI_TRACK_EVENT = "fetch_track"

var current_sample;

export function updateEditorTrack() {
    const inject = document.getElementById(MIDI_INJECTOR);
    console.log("Injected")
  
    const inputElement = document.getElementById(MIDI_FILE_INPUT);
    const fileList = inputElement.files;
    const file = fileList[0];
  
    updateComponentWithFile(inject, file)
}

export function updateEditorWithFile(file) {
    const inject = document.getElementById("injectMIDI");
    console.log("Injected");

    updateComponentWithFile(inject, file)
}

function updateComponentWithFile(component, file) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    component.files = dataTransfer.files;
  
    const e = new Event(INSERT_MIDI_EVENT)
    component.dispatchEvent(e);
    console.log("Dispatched: " + INSERT_MIDI_EVENT);
}

export function deactivateEditor() {
    const pause_element = document.getElementById(PAUSE_PLAYER_ELEMENT);
    if (pause_element == null){
        console.log("Null pause element")
        return
    }
    console.log("Injected: ", pause_element)

    const e = new Event(DISABLE_EDITOR_EVENT)
    pause_element.dispatchEvent(e);
    console.log("Dispatched: " + DISABLE_EDITOR_EVENT);
}

export function clearAllTracks() {
    deactivateEditor()
    const inject = document.getElementById(MIDI_INJECTOR);

    const e = new Event(CLEAR_EDITOR_TRACK_EVENT)
    inject.dispatchEvent(e);
    console.log("Dispatched: " + CLEAR_EDITOR_TRACK_EVENT);
}

// Sample
export function submitRawSample() {
    if (!(current_sample instanceof Blob)){
        console.log("Sample isn't a blob")
        return
    }

    var reader = new FileReader();
    reader.onload = function() {
        var arrayBuffer = this.result;
        var encodedString = _arrayBufferToBase64(arrayBuffer)
        submitted_sample = encodedString
    }
    reader.readAsArrayBuffer(current_sample);
}

export function submitSample() {
    refreshSubmittedTrack()
}

function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

export async function refreshSubmittedTrack() {
    const inject = document.getElementById(MIDI_INJECTOR);
    
    const e = new Event(FETCH_MIDI_TRACK_EVENT)
    inject.dispatchEvent(e);
    console.log("Dispatched: " + FETCH_MIDI_TRACK_EVENT);

    const track_base64 = inject.getAttribute('track_base64')

    deactivateEditor()

    submitted_sample = track_base64
}

export function removeSample() {
    submitted_sample = null
    clearAllTracks()
}