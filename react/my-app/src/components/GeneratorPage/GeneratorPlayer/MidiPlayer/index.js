import React from 'react'
import './PlayerStyle.css'
import 'html-midi-player'
import { PlayerWrapper } from './MidiPlayerElements'

const MidiPlayer = ({disabled, hidden}) => {

  return (
    <PlayerWrapper id="section3" hidden={hidden}>
      <midi-player id="myPlayer" sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus" visualizer="#myVisualizer">
      </midi-player>
      <midi-visualizer type="piano-roll" id="myVisualizer">
      </midi-visualizer>
    </PlayerWrapper>
  )
}

export default MidiPlayer