import { tempoEnum, sRangeEnum, volumeEnum, sentimentEnum } from './GeneratorInput/EnumParametersData'
import { updateTrackDisplay } from './UpdateMusicPlayers'

const machineAddress = "http://150.254.131.192:8080/"

const notSelected = "none"

const negative_sentiment = "sent0"
const positive_sentiment = "sent1"

function parseInputEnum(currentEnum) {
    const optionDiv = document.getElementById(currentEnum.id).querySelectorAll("#enumOption")

   for (var i = 0; i < optionDiv.length; i++) {
        const entry = optionDiv[i]
        if (entry.selected !== notSelected){
            return entry.selected
        }
    }
    return notSelected
}

export function getMIDIRequest() {

    const tempo = parseInputEnum(tempoEnum)
    const soundsRange = parseInputEnum(sRangeEnum)
    const volume = parseInputEnum(volumeEnum)
    const sentiment = parseInputEnum(sentimentEnum)

    const parametersArray = [tempo, soundsRange, volume, sentiment]

    console.log(parametersArray)

    if (parametersArray.includes(notSelected)) {
        //alert("Select all enum options")
        // TODO: replace
        rawGetMIDIRequest()
        return notSelected
    }

    var urlSentiment = negative_sentiment
    
    if (sentiment == "Positive"){
        urlSentiment = positive_sentiment
    }

    const url = new URL(machineAddress + urlSentiment)

    url.searchParams.append('tempo', tempo)
    url.searchParams.append('soundsRange', soundsRange)
    url.searchParams.append('volumeLevel', volume)
  
    sendRequest(url.toString())
}

// Without any parameters, only sentiment
export function rawGetMIDIRequest() {
    const sentiment = parseInputEnum(sentimentEnum)
    if (sentiment === notSelected) {
        alert("Select sentiment enum options")
        return notSelected
    }
    var urlSentiment = negative_sentiment

    if (sentiment == "Positive"){
        urlSentiment = positive_sentiment
    }
    const url = new URL("http://150.254.131.192:8080/" + urlSentiment)
    sendRequest(url)
}

function sendRequest(url)
{
    console.log("Request sended: " + "GET " + url)

    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
    req.setRequestHeader('Access-Control-Allow-Origin', '*');
    req.responseType = "blob";
    req.onload = (event) => {
        const blob = req.response;
        console.log("Received: " + blob)
        // replaceTrackInViewComponent(blob)
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
    req.send();
}