
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

  const tempo = document.getElementById("selectedTempo");
  const tempoStr = tempo.options[tempo.selectedIndex].text;

  const soundsRange = document.getElementById("selectedSoundsRange");
  const soundsRangeStr = soundsRange.options[soundsRange.selectedIndex].text;

  const volumeLevel = document.getElementById("selectedVolumeLevel");
  const volumeLevelStr = volumeLevel.options[volumeLevel.selectedIndex].text;
  
  const url = new URL("http://150.254.131.192:8080/inference")
  url.searchParams.append('tempo', tempoStr)
  url.searchParams.append('soundsRange', soundsRangeStr)
  url.searchParams.append('volumeLevel', volumeLevelStr)

  sendRequest(url.toString())
}

function sendRequest(url)
{
  var requestLog = document.getElementById('requestLog');
  requestLog.innerHTML = "Request sended: " + "GET " + url
  console.log("Request sended: " + "GET " + url)

  const req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
  req.setRequestHeader('Access-Control-Allow-Origin', '*');
  req.responseType = "blob";
  req.onload = (event) => {
    const blob = req.response;
    requestLog.innerHTML = "Received: " + blob
    replaceTrack(blob)
  }
  req.onerror = (event) => {
    if (req.responseType != "text")
    {
      requestLog.innerHTML = 'Network request failed'
    }
    else
    {
      requestLog.innerHTML = req.responseText
    }
  }
  req.ontimeout = (event) => {
    if (req.responseType != "text")
    {
      requestLog.innerHTML = 'Network request failed (timeout)'
    }
    else
    {
      requestLog.innerHTML = req.responseText
    }
  }
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