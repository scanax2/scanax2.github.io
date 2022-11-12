import React, {useState, useRef} from 'react'
import { 
  GeneratorContainer,
  GeneratorInputContainer,
  GeneratorPlayerContainer
} from './GeneratorElements'
import GeneratorInput from './GeneratorInput'
import GeneratorPlayer from './GeneratorPlayer'

const GeneratorSection = () => {
  return (
    <>
      <GeneratorContainer>
          <GeneratorInputContainer>
            <GeneratorInput />
          </GeneratorInputContainer>
          <GeneratorPlayerContainer>
            <GeneratorPlayer />
          </GeneratorPlayerContainer>
      </GeneratorContainer>
    </>
  )
}

export default GeneratorSection
