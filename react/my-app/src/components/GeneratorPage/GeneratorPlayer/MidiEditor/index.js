import React, { useEffect } from 'react'
import 'html-midi-player'
import { EditorWrapper } from './MidiEditorElements'
import { Helmet } from 'react-helmet'
import './EditorStyles.css'


const MidiEditor = ({disabled, hidden}) => {
  return (
    <EditorWrapper hidden={hidden}>
        <div id="beepboxEditorContainer">
        </div>
        <Helmet>
           <script type="text/javascript" src="./beepbox_editor.min.js"></script>
        </Helmet>
    </EditorWrapper>
  )
}

export default MidiEditor