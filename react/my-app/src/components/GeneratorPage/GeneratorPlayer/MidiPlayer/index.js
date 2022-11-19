import React from 'react'
import './PlayerStyle.css'
import 'html-midi-player'

const MidiPlayer = ({disabled}) => {

  return (
    <section id="section3">
      <midi-player id="myPlayer" src="https://cdn.jsdelivr.net/gh/cifkao/html-midi-player@2b12128/twinkle_twinkle.mid"
                    sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus" visualizer="#myVisualizer" >
      </midi-player>
      <midi-visualizer type="piano-roll" id="myVisualizer" className="testVisualizer" src="https://cdn.jsdelivr.net/gh/cifkao/html-midi-player@2b12128/twinkle_twinkle.mid">
      </midi-visualizer>
    </section>
  )
}

export default MidiPlayer
