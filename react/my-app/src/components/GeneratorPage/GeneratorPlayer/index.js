import React, {useState, useEffect, componentDidMount, componentWillUnmount} from 'react'
import { 
  GeneratorPlayerTabsWrapper,
  GeneratorPlayerToolbar,
  GeneratorPlayerWindow, 
  GeneratorPlayerWrapper,
  GeneratorPlayerTab
} from './GeneratorPlayerElements'
import MidiPlayer from './MidiPlayer'
import MidiEditor from './MidiEditor'
import { pauseAllTracks } from '../UpdateMusicPlayers'


const GeneratorPlayer = ({disabled}) => {
  return (
    <GeneratorPlayerWrapper style={disabled ? {pointerEvents: "none", opacity: "0.4"} : {}}>
      <GeneratorPlayerWindow>
        <MidiEditor disabled={disabled}/>
      </GeneratorPlayerWindow>
    </GeneratorPlayerWrapper>
  )
}

export default GeneratorPlayer
