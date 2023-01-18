import { getMIDIRequest } from './RequestsManager'
import { removeSample, submitSample } from './UpdateMusicPlayers'

// GLOBALS
export const INIT_STATE = "init_state" // initial state
const SAMPLE_PROCESSING_STATE = "sample_processing"
export const MUSIC_GENERATED_STATE = "music_generated"

const GENERATE_MUSIC_BUTTON_TEXT = "Generate music"
const SUMBIT_SAMPLE_BUTTON_TEXT = "Add sample"

const ADD_SAMPLE_BUTTON_TEXT = "Add sample"
const BACK_SAMPLE_BUTTON_TEXT = "Back"
const REMOVE_SAMPLE_BUTTON_TEXT = "Remove"

var toggleState;

// Add sample button / back / remove
export function switchStateOnAddSampleButton(currentState, isSampleAdded, toggleSampleState, toggleFileDialog) {

    // Add sample label
    if (currentState == INIT_STATE && isSampleAdded == false) {
        toggleFileDialog()
    }
    // Back button label
    else if (currentState == SAMPLE_PROCESSING_STATE && isSampleAdded == false) {
        toggleSampleState(INIT_STATE, false, false)
        removeSample()
    }
    // Remove button label
    else if (currentState == INIT_STATE && isSampleAdded == true){
        toggleSampleState(INIT_STATE, false, false)
        removeSample()
    }
}

// Start processing sample via file dialog
export function switchStateOnStartProcessingSample(toggleSampleState, toggleFileDialog) {
    toggleSampleState(SAMPLE_PROCESSING_STATE, true, false)
    toggleFileDialog()
}

// Generate music / submit sample
export function switchStateOnGeneratorButton(currentState, toggleSampleState) {
    // Generate music
    if (currentState == INIT_STATE) {
        toggleState = toggleSampleState
        getMIDIRequest(toggleState)
        // toggleSampleState(MUSIC_GENERATED_STATE)
    }
    // Submit sample
    else if (currentState == SAMPLE_PROCESSING_STATE) {
        submitSample()
        toggleSampleState(INIT_STATE, false, true)
    }
}

export function getLabels(isSampleProcessing, isSampleAdded) {
    var labels = [GENERATE_MUSIC_BUTTON_TEXT, ADD_SAMPLE_BUTTON_TEXT]

    // Generator
    if (isSampleProcessing) {
        labels[0] = SUMBIT_SAMPLE_BUTTON_TEXT
    }
    else {
        labels[0] = GENERATE_MUSIC_BUTTON_TEXT
    }

    // Sample
    if (isSampleProcessing){
        labels[1] = BACK_SAMPLE_BUTTON_TEXT
    }
    else if (isSampleAdded){
        labels[1] = REMOVE_SAMPLE_BUTTON_TEXT
    }
    else {
        labels[1] = ADD_SAMPLE_BUTTON_TEXT
    }

    return labels;
}