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
  //const thisIsMyCopy = '<tracking-preview videoid="10"></tracking-preview>';

  // Switch state
  const [currentState, setCurrentState] = useState("view")

  const toggle = (selected) => {
      console.log(selected);
      setCurrentState(prevState => selected);
  };

  useEffect(() => {
    const test = (event) => {
      // NOTE: This message isn't used in modern browsers, but is required
      const message = 'Sure you want to leave?';
      console.log(message)
    };

    console.log("some magic")
    return () => {
      pauseAllTracks()
    }
  }, [])

  return (
    <GeneratorPlayerWrapper style={disabled ? {pointerEvents: "none", opacity: "0.4"} : {}}>
      <GeneratorPlayerToolbar>
        <GeneratorPlayerTabsWrapper>
          <GeneratorPlayerTab selected={currentState} label={'view'} onClick={() => toggle('view')}>View</GeneratorPlayerTab>
          <GeneratorPlayerTab selected={currentState} label={'edit'} onClick={() => toggle('edit')}>Edit</GeneratorPlayerTab>
        </GeneratorPlayerTabsWrapper>
      </GeneratorPlayerToolbar>
      <GeneratorPlayerWindow>
        <MidiPlayer disabled={disabled} hidden={'view' != currentState} />
        <MidiEditor disabled={disabled} hidden={'edit' != currentState} />
      </GeneratorPlayerWindow>
    </GeneratorPlayerWrapper>
  )
}

export default GeneratorPlayer
