import React, {useState, useRef} from 'react'
import { 
  GeneratorContainer,
  GeneratorInputContainer,
  GeneratorPlayerContainer
} from './GeneratorElements'
import GeneratorInput from './GeneratorInput'
import GeneratorPlayer from './GeneratorPlayer'
import GeneratorFileDialog from './GeneratorFileDialog'

const GeneratorSection = () => {
  return (
    <GeneratorContainer>
          <GeneratorFileDialog></GeneratorFileDialog>
          <GeneratorInputContainer>
            <GeneratorInput />
          </GeneratorInputContainer>
          <GeneratorPlayerContainer>
            <GeneratorPlayer disabled={true}/>
          </GeneratorPlayerContainer>
    </GeneratorContainer>
  )
}

export default GeneratorSection
