import React, {useState} from 'react'
import { 
  GeneratorPlayerTabsWrapper,
  GeneratorPlayerToolbar,
  GeneratorPlayerWindow, 
  GeneratorPlayerWrapper,
  GeneratorPlayerTab
} from './GeneratorPlayerElements'

const GeneratorPlayer = () => {

  // Switch state
  const [currentState, setCurrentState] = useState("view")

  const toggle = (selected) => {
      console.log(selected);
      setCurrentState(prevState => selected);
  };

  return (
    <GeneratorPlayerWrapper>
      <GeneratorPlayerToolbar>
        <GeneratorPlayerTabsWrapper>
          <GeneratorPlayerTab selected={currentState} label={'view'} onClick={() => toggle('view')}>View</GeneratorPlayerTab>
          <GeneratorPlayerTab selected={currentState} label={'edit'} onClick={() => toggle('edit')}>Edit</GeneratorPlayerTab>
        </GeneratorPlayerTabsWrapper>
      </GeneratorPlayerToolbar>
      <GeneratorPlayerWindow />
    </GeneratorPlayerWrapper>
  )
}

export default GeneratorPlayer
