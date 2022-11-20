import React, {useState, useRef} from 'react'
import { 
  GeneratorContainer,
  GeneratorInputContainer,
  GeneratorPlayerContainer
} from './GeneratorElements'
import GeneratorInput from './GeneratorInput'
import GeneratorPlayer from './GeneratorPlayer'
import GeneratorFileDialog from './GeneratorFileDialog'
import { getMIDIRequest } from './RequestsManager'
import { clearTrackDisplay } from './UpdateMusicPlayers'


const GeneratorFSM = {
  'RawInput': ['Generate music', 'Add sample'],
  'ProcessingSample': ['Add sample', 'Back'],
  'SampleAdded': ['Generate music', 'Remove']
};

const GeneratorSection = () => {

  const [isFileDialogOpen, setIsOpen] = useState(false);

  const addSampleClick = () => {
      if (currentSampleState == 'SampleAdded'){
        toggleSampleState("RawInput")
      } // exit from sample
      else if (currentSampleState == "ProcessingSample"){
        clearTrackDisplay()
        toggleSampleState("RawInput")
      }
      else if (currentSampleState == "RawInput"){
        setIsOpen(!isFileDialogOpen);
      }
  }

    // Sample add process
  const [currentSampleState, setCurrentState] = useState("RawInput")

  const toggleSampleState = (state) => {
    setCurrentState(prevState => state);
  };

  const generateMusicClick = () => {
    if (currentSampleState == "ProcessingSample"){
      setCurrentState(prevState => 'SampleAdded');
    }
    else{
      getMIDIRequest()
    }
  }

  return (
    <GeneratorContainer>
          <GeneratorFileDialog isOpen={isFileDialogOpen} toggleModal={addSampleClick} toggleSampleState={toggleSampleState}></GeneratorFileDialog>
          <GeneratorInputContainer>
            <GeneratorInput toggleModal={addSampleClick} sampleState={GeneratorFSM[currentSampleState]} generateMusicClick={generateMusicClick}/>
          </GeneratorInputContainer>
          <GeneratorPlayerContainer>
            <GeneratorPlayer disabled={currentSampleState != "ProcessingSample"}/>
          </GeneratorPlayerContainer>
    </GeneratorContainer>
  )
}

export default GeneratorSection
