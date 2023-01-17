import React, {useState} from 'react'
import { 
  GeneratorInputWrapper,
  GeneratorInputRow,
  BtnWrapper,
  DropdownWrapper,
  GeneratorSettingsWrapper,
  SmallBtnWrapper
} from './GeneratorInputElements'
import GeneratorInputEnum from './GeneratorInputEnum'
import { tempoEnum, sRangeEnum, volumeEnum, sentimentEnum } from './EnumParametersData'
import { instrumentsDropdown, durationDropdown } from './EnumDropdownData'
import { Button } from '../../ButtonElements'
import GeneratorEnumDropdown from './GeneratorEnumDropdown'

export const GeneratorInput = ({refs, toggleModal, labels, generateMusicClick}) => {

  // Clear all presets
  const [clearTrigger, setTrigger] = useState(0);

  const generatorText = labels[0];
  const sampleButtonText = labels[1];
  
  return (
    <GeneratorInputWrapper>
        <GeneratorInputRow>
            <GeneratorInputEnum id={tempoEnum.id} {...tempoEnum} clearTrigger={clearTrigger}/>
            <GeneratorInputEnum id={tempoEnum.id} {...sRangeEnum} clearTrigger={clearTrigger}/>
            <GeneratorInputEnum id={volumeEnum.id} {...volumeEnum} clearTrigger={clearTrigger}/>
            <GeneratorInputEnum id={sentimentEnum.id} {...sentimentEnum} clearTrigger={clearTrigger}/>
        </GeneratorInputRow>
        <GeneratorInputRow>
            <SmallBtnWrapper background={'#08080890'}>
            <Button primary={false} dark={false} fontBig={false} 
            onClick={() => {setTrigger(() => clearTrigger + 1);}}>
              Clear x
            </Button>
            </SmallBtnWrapper>
        </GeneratorInputRow>
        <GeneratorInputRow>
            <GeneratorSettingsWrapper>
            <BtnWrapper background={'#000'}>
                <Button onClick={toggleModal} primary={false} dark={false} fontBig={true}>{sampleButtonText}</Button>
            </BtnWrapper>
            <DropdownWrapper>
                <GeneratorEnumDropdown {...durationDropdown}/>
            </DropdownWrapper>
            <BtnWrapper background={'#32CD32'}>
                <Button onClick={generateMusicClick} primary={false} dark={false} fontBig={true}>{generatorText}</Button>
            </BtnWrapper>
            </GeneratorSettingsWrapper>
        </GeneratorInputRow>
    </GeneratorInputWrapper>
  )
}

export default GeneratorInput
