import React, { useEffect } from 'react'
import 'html-midi-player'
import { EditorWrapper } from './MidiEditorElements'


const MidiEditor = ({disabled, hidden}) => {

    useEffect(() => {
        const scriptbabel6 = document.createElement('script');
        scriptbabel6.src = "https://unpkg.com/babel-standalone@6/babel.min.js";
        scriptbabel6.type = "text/babel";
        scriptbabel6.async = false;
        document.body.append(scriptbabel6);
        console.log("babel loaded https://unpkg.com/babel-standalone@6/babel.min.js")

        const scriptbabel = document.createElement('script');
        scriptbabel.src = "https://unpkg.com/@babel/standalone/babel.min.js";
        scriptbabel.type = "text/babel";
        scriptbabel.async = false;
        document.body.append(scriptbabel);
        console.log("babel loaded https://unpkg.com/@babel/standalone/babel.min.js")

        const script = document.createElement('script');
        //script.type = "text/babel" text/javascript
        script.src = "/beepbox_editor.js";
        script.type = "text/babel"
        script.async = false;
        console.log("editor loaded")
      
        //document.querySelector("#beepboxEditorContainer").appendChild(script);
        document.body.append(script);
      
        /*return () => {
          document.querySelector("#beepboxEditorContainer").removeChild(script);
        }*/
      }, []);

  return (
    <EditorWrapper hidden={hidden}>
        <div>HELLO</div>
        <div id="beepboxEditorContainer">
            <noscript>
                Sorry, JummBox requires a JavaScript-enabled browser.
            </noscript>
        </div>
        
    </EditorWrapper>
  )
}

export default MidiEditor