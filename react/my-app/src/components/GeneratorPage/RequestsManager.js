import { MUSIC_GENERATED_STATE } from './GeneratorFSM'
import { tempoEnum, sRangeEnum, volumeEnum, sentimentEnum } from './GeneratorInput/EnumParametersData'
import { submitted_sample, updateEditorWithFile } from './UpdateMusicPlayers'

// GLOBALS
const machineAddress = "http://150.254.131.192:8080/generate"

const NOT_SELECTED = "none"

const negative_sentiment = 0
const positive_sentiment = 1

// sent: {0/1}, tempo: {'fast', 'medium', 'slow'}, pitch: {'high', 'medium', 'low'}, duration: {0/1/2} - 0 - (0:15 - 0:45), 1 - (0:45, 1:30), 2 - (1:30 - 3:00)
const music_parameters = ['sent', 'tempo', 'pitch', 'volume', 'duration']
const start_sequence = 'start_seq_file'


// FUNCTIONS
function parseInputEnum(currentEnum) {
    const optionDiv = document.getElementById(currentEnum.id).querySelectorAll("#enumOption")

   for (var i = 0; i < optionDiv.length; i++) {
        const entry = optionDiv[i]
        if (entry.selected !== NOT_SELECTED){
            return entry.selected.toLowerCase()
        }
    }
    return NOT_SELECTED.toLowerCase()
}

export function getMIDIRequest(toggleState) {

    var sentiment = parseInputEnum(sentimentEnum)
    if (sentiment == "negative"){
        sentiment = negative_sentiment
    }
    else if (sentiment == "positive"){
        sentiment = positive_sentiment
    }
    else{
        sentiment = NOT_SELECTED
        // Show error message
        alert("Select sentiment")
        return;
    }

    const tempo = parseInputEnum(tempoEnum)
    const soundsRange = parseInputEnum(sRangeEnum)
    const volume = parseInputEnum(volumeEnum)

    const parametersArray = [sentiment, tempo, soundsRange, volume]
    console.log("Parsed parameters: ")
    console.log(parametersArray)

    const parametersDictionary = {}
    for (var i = 0; i < parametersArray.length; i++) {
        const parameter = parametersArray[i]
        if (parameter == NOT_SELECTED){
            continue
        }
        const type = music_parameters[i]
        parametersDictionary[type] = parameter
    }
    if (submitted_sample != null){
        parametersDictionary[start_sequence] = submitted_sample
    }
    console.log("Parsed dictionary: ")
    console.log(parametersDictionary)

    const url = new URL(machineAddress)
    sendRequest(url.toString(), parametersDictionary, toggleState)
}

function sendRequest(url, bodyDictionary, toggleState)
{
    console.log("Request sended: " + "POST " + url)

    const req = new XMLHttpRequest();
    req.open("POST", url, true);
    req.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
    req.setRequestHeader('Access-Control-Allow-Origin', '*');
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.responseType = "blob";

    req.onload = (event) => {
        processResponse(req, toggleState)
    }
    req.onerror = (event) => {
        if (req.responseType != "text")
        {
            console.log('Network request failed')
        }
        else
        {
            console.log(req.responseText)
        }
    }
    req.ontimeout = (event) => {
        if (req.responseType != "text")
        {
            console.log('Network request failed (timeout)')
        }
        else
        {
            console.log(req.responseText)
        }
    }
    const jsonBody = JSON.stringify(bodyDictionary)
    console.log('with body' + jsonBody)

    req.send(jsonBody);
}

function processResponse(req, toggleState){
    const blob = req.response;
    console.log("Received: " + blob)

    const trackFile = new File([blob], "generated_music");
    toggleState(MUSIC_GENERATED_STATE)

    updateEditorWithFile(trackFile);
}