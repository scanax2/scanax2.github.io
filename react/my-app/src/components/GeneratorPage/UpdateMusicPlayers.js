
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

        var arrayBuffer = this.result,
        array = new Uint8Array(arrayBuffer),
        binaryString = String.fromCharCode.apply(null, array);
        submitted_sample = binaryString
    }
    reader.readAsArrayBuffer(current_sample);
}

export function removeSample() {
    submitted_sample = null
    clearAllTracks()
}