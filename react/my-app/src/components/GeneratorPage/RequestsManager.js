import { tempoEnum, sRangeEnum, volumeEnum, sentimentEnum } from './GeneratorInput/EnumParametersData'
import { submitted_sample, updateEditorWithFile } from './UpdateMusicPlayers'

const machineAddress = "http://150.254.131.192:8080/upload_file"

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

    const url = new URL(machineAddress)// + urlSentiment)

    /*url.searchParams.append('tempo', tempo)
    url.searchParams.append('soundsRange', soundsRange)
    url.searchParams.append('volumeLevel', volume)
    
    if (submitted_sample != null){
        url.searchParams.append('sample', submitted_sample)
    }*/

    sendRequest(url.toString(), submitted_sample)
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
    const url = new URL("http://150.254.131.192:8080/upload_file")// + urlSentiment)

    /*
    if (submitted_sample != null){
        url.searchParams.append('sample', submitted_sample)
    }*/
    sendRequest(url, submitted_sample)
}

function sendRequest(url, body)
{
    console.log(body)
    console.log("Request sended: " + "POST " + url)

    const req = new XMLHttpRequest();
    req.open("POST", url, true);
    req.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
    req.setRequestHeader('Access-Control-Allow-Origin', '*');
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.responseType = "blob";

    req.onload = (event) => {
        const blob = req.response;
        console.log("Received: " + blob)
        const inject = document.getElementById("injectMIDI");
        console.log("Injected");

        const someFile = new File([blob], "response_plik");
        updateEditorWithFile(inject, someFile);
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
    const jsonBody = JSON.stringify({ "sent": 1, "start_seq_file": body })
    console.log('with body' + jsonBody)

    req.send(jsonBody);
}