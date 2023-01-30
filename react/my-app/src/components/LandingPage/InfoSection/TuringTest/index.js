import React from 'react'
import { ButtonE } from '../../../ButtonElements'
import {
    InfoContainer,
    InfoWrapper,
    TextWrapper,
    Heading,
    Subtitle,
    BtnWrap,
    SubHeading,
    SubHeadingWrap,
    IconWrap,
    Icon,
    SubHeadingWrapSmall
} from './../InfoSectionElements'

const LINK_TO_TEST = "https://script.google.com/macros/s/AKfycbyPVEPguinhxzVAj9tkLekw7fBA-j3yRNbYiJGrZuPofePC3ihcvb2lz2i6tBYj67beQw/exec"


const InfoSectionTuringTest = ({id, lightBg, topLine, lightText, 
    headline, darkText, description, buttonLabel, img, alt, primary, dark, dark2}) => {
  return (
      <InfoContainer lightBg={lightBg} id={id}>
        <InfoWrapper>
            <TextWrapper>
                <Heading lightText={lightText}>{headline}</Heading>
                <SubHeadingWrapSmall>
                    <Subtitle centerAlign={false} darkText={darkText}>{description}</Subtitle>
                </SubHeadingWrapSmall>
                <SubHeadingWrapSmall>
                </SubHeadingWrapSmall>
                <BtnWrap>
                    <ButtonE target="_blank" href={LINK_TO_TEST}
                    smooth={true}
                    duration={500}
                    spy={true}
                    exact="true"
                    offset={-60}
                    primary={primary ? 1 : 0}
                    dark={dark ? 1 : 0}
                    dark2 ={dark2 ? 1 : 0}
                    big={true}
                    >{buttonLabel}
                    </ButtonE>
                </BtnWrap>
            </TextWrapper>
        </InfoWrapper>
      </InfoContainer>
  )
}

export default InfoSectionTuringTest
