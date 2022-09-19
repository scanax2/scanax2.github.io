
function updateTrackDisplay() {

    const inputElement = document.getElementById("input");
    const fileList = inputElement.files;
    const file = fileList[0];
    
    const url = URL.createObjectURL(file);

    const player = document.getElementById("player");
    const visualizer = document.getElementById("visualizer");

    player.src = url;
    visualizer.src = url;
}

function updateVisualizerType() {
  
  const selected = document.getElementById("selectedVisualizer");
  const selectedStr = selected.options[selected.selectedIndex].text;

  const visualizer = document.getElementById("visualizer");

  visualizer.type = selectedStr;
}

function main() {

  const inputElement = document.getElementById("input");
  inputElement.addEventListener('change', updateTrackDisplay);

  const selectedType = document.getElementById("selectedVisualizer");
  selectedType.addEventListener('change', updateVisualizerType);
}