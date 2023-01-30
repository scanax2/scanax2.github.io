import React, { useState } from 'react'
import { 
  GeneratorContainer,
  GeneratorInputContainer,
  GeneratorPlayerContainer
} from './GeneratorElements'
import GeneratorInput from './GeneratorInput'
import GeneratorPlayer from './GeneratorPlayer'
import GeneratorFileDialog from './GeneratorFileDialog'
import { 
  INIT_STATE, 
  switchStateOnAddSampleButton, 
  switchStateOnStartProcessingSample, 
  switchStateOnGeneratorButton,
  getLabels
} from './GeneratorFSM'
import GeneratorLoadingIndicator from './GeneratorLoadingIndicator'

const GeneratorSection = () => {

  const [isFileDialogOpen, setIsOpen] = useState(false);

  const [currentSampleState, setCurrentState] = useState(INIT_STATE)
  const [isSampleProcessing, setSampleProcessing] = useState(false);
  const [isSampleAdded, setSampleAdded] = useState(false);

  const [isLoading, setLoadingIndicator] = useState(false);

  const addSampleClick = () => {
    switchStateOnAddSampleButton(currentSampleState, isSampleAdded, toggleSampleState, () => setIsOpen(!isFileDialogOpen));
  }

  const toggleSampleState = (state, isSampleProcessing, isSampleAdded) => {
    setCurrentState(prevState => state)
    setSampleProcessing(prevState => isSampleProcessing)
    setSampleAdded(prevState => isSampleAdded)
  }

  const generateMusicClick = () => {
    switchStateOnGeneratorButton(currentSampleState, toggleSampleState, setLoadingIndicator)
  }

  return (
    <GeneratorContainer>
          <GeneratorLoadingIndicator isLoading={isLoading}/>
          <GeneratorFileDialog isOpen={isFileDialogOpen} toggleModal={addSampleClick} toggleSampleState={
            () => switchStateOnStartProcessingSample(toggleSampleState, () => setIsOpen(!isFileDialogOpen))
            }></GeneratorFileDialog>
          <GeneratorInputContainer>
            <GeneratorInput toggleModal={addSampleClick} labels={getLabels(isSampleProcessing, isSampleAdded)} generateMusicClick={generateMusicClick}/>
          </GeneratorInputContainer>
          <GeneratorPlayerContainer>
            <GeneratorPlayer disabled={currentSampleState == INIT_STATE}/>
          </GeneratorPlayerContainer>
    </GeneratorContainer>
  )
}

export default GeneratorSection
