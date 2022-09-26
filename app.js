
// const SERVER_URL = "http://127.0.0.1:8080"

function updateTrackDisplay() {

    const inputElement = document.getElementById("input");
    const fileList = inputElement.files;
    const file = fileList[0];
    
    replaceTrack(file)
}

function updateVisualizerType() {
  
  const selected = document.getElementById("selectedVisualizer");
  const selectedStr = selected.options[selected.selectedIndex].text;

  const visualizer = document.getElementById("visualizer");

  visualizer.type = selectedStr;
}

function getMIDIRequest() {

    //const query = "MIDI"
    // const url = SERVER_URL + "/?name=" + query
    
    const url = "http://150.254.131.192:8080/inference"
    console.log("sended to: " + url)

    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "blob";
    req.onload = (event) => {
      const blob = req.response;
      console.log("Received: " + blob)
      replaceTrack(blob)
  };
  
  req.send();
}

function replaceTrack(file) {
  const url = URL.createObjectURL(file);

  const player = document.getElementById("player");
  const visualizer = document.getElementById("visualizer");

  player.src = url;
  visualizer.src = url;
}

function main() {

  const inputElement = document.getElementById("input");
  inputElement.addEventListener('change', updateTrackDisplay);

  const selectedType = document.getElementById("selectedVisualizer");
  selectedType.addEventListener('change', updateVisualizerType);
}