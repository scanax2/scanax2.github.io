
export var submitted_sample;

var current_sample;

export function clearTrackDisplay() {
    const player = document.getElementById("myPlayer");
    const visualizer = document.getElementById("myVisualizer");
  
    player.src = "";
    visualizer.src = "";
}

export function updateTrackDisplay() {

    const inputElement = document.getElementById("midi_file_input");
    const fileList = inputElement.files;
    const file = fileList[0];

    current_sample = file;
    
    replaceTrackInViewComponent(file)
}

export function updateEditorTrack() {
    const inject = document.getElementById("injectMIDI");
    console.log("Injected")
  
    const inputElement = document.getElementById("midi_file_input");
    const fileList = inputElement.files;
    const file = fileList[0];
  
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    inject.files = dataTransfer.files;
  
    const e = new Event('inject_MIDI')
    inject.dispatchEvent(e);
    console.log("Dispatched event");
}

export function deactivateEditor() {
    const pause_element = document.getElementById("pausePlayer");
    if (pause_element == null){
        console.log("Null pause element")
        return
    }
    console.log("Injected", pause_element)
    const e = new Event('deactivateEditor')
    pause_element.dispatchEvent(e);
    console.log("Dispatched event");
}

export function replaceTrackInViewComponent(file) {
    const url = URL.createObjectURL(file);
  
    const player = document.getElementById("myPlayer");
    const visualizer = document.getElementById("myVisualizer");
  
    player.src = url;
    visualizer.src = url;
}

export function pauseAllTracks() {
    /*const player = document.getElementById("myPlayer");
    const visualizer = document.getElementById("myVisualizer");
  
    player.src = url;
    visualizer.src = url;*/
    console.log("all paused");
    // document.querySelectorAll('audio').forEach(el => el.pause());
}

export function clearAllTracks() {
    
}

// Sample
export function submitSample() {
    var reader = new FileReader();
    reader.onload = function() {

        var arrayBuffer = this.result;
        var encodedString = _arrayBufferToBase64(arrayBuffer)
        submitted_sample = encodedString
    }
    reader.readAsArrayBuffer(current_sample);
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

export function removeSample() {
    submitted_sample = null
    clearAllTracks()
}