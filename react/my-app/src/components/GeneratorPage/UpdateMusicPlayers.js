
export var submitted_sample;

var current_sample;

export function clearTrackDisplay() {
    /* TMP player turned off
    const player = document.getElementById("myPlayer");
    const visualizer = document.getElementById("myVisualizer");
  
    player.src = "";
    visualizer.src = "";*/
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
  
    updateEditorWithFile(inject, file)
}

export function updateEditorWithFile(component, file) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    component.files = dataTransfer.files;
  
    const e = new Event('inject_MIDI')
    component.dispatchEvent(e);
    console.log("Dispatched inject_MIDI");
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
    console.log("Dispatched deactivateEditor");
}

export function replaceTrackInViewComponent(file) {
    /* TMP player turned off
    const url = URL.createObjectURL(file);
    
    const player = document.getElementById("myPlayer");
    const visualizer = document.getElementById("myVisualizer");
  
    player.src = url;
    visualizer.src = url;*/
}

export function clearAllTracks() {
    deactivateEditor()
    const inject = document.getElementById("injectMIDI");
    const e = new Event('clear_track')
    inject.dispatchEvent(e);
    console.log("Dispatched clear_track");
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

function converBase64toBlob(content, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = window.atob(content); //method which converts base64 to binary
    var byteArrays = [
    ];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {
      type: contentType
    }); //statement which creates the blob
    return blob;
}

export async function refreshSubmittedTrack() {
    const inject = document.getElementById("injectMIDI");
    const e = new Event('fetch_track')
    inject.dispatchEvent(e);
    console.log("Dispatched fetch_track");

    const track_base64 = inject.getAttribute('track_base64')

    deactivateEditor()

    submitted_sample = track_base64

    // How to insert
    /*const file = converBase64toBlob(submitted_sample, '')
    var fileF = new File([file], "name");
    updateEditorWithFile(inject, fileF)*/
}

export function removeSample() {
    submitted_sample = null
    clearAllTracks()
}