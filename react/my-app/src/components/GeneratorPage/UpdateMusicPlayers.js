
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
    
    replaceTrackInViewComponent(file)
}

export function replaceTrackInViewComponent(file) {
    const url = URL.createObjectURL(file);
  
    const player = document.getElementById("myPlayer");
    const visualizer = document.getElementById("myVisualizer");
  
    player.src = url;
    visualizer.src = url;
}