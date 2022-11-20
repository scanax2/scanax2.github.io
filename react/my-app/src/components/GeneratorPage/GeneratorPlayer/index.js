import React, {useState} from 'react'
import { 
  GeneratorPlayerTabsWrapper,
  GeneratorPlayerToolbar,
  GeneratorPlayerWindow, 
  GeneratorPlayerWrapper,
  GeneratorPlayerTab
} from './GeneratorPlayerElements'
import MidiPlayer from './MidiPlayer'


const GeneratorPlayer = ({disabled}) => {
  //const thisIsMyCopy = '<tracking-preview videoid="10"></tracking-preview>';

  // Switch state
  const [currentState, setCurrentState] = useState("view")

  const toggle = (selected) => {
      console.log(selected);
      setCurrentState(prevState => selected);
  };

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
      </GeneratorPlayerWindow>
    </GeneratorPlayerWrapper>
  )
}

export default GeneratorPlayer
