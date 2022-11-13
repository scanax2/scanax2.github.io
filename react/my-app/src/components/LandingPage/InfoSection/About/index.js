import React from 'react'
import { ButtonL } from '../../../ButtonElements'
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
    Icon
} from './../InfoSectionElements'
import { musicForGamesHeader, uniquenessHeader, customizableHeader } from './../About/SubHeaderData'

const InfoSectionAbout = ({id, lightBg, topLine, lightText, 
    headline, darkText, description, buttonLabel, img, alt, primary, dark, dark2}) => {
  return (
      <InfoContainer lightBg={lightBg} id={id}>
        <InfoWrapper>
            <TextWrapper>
                <Heading lightText={lightText}>{headline}</Heading>
                <SubHeadingWrap>
                    <SubHeading>{musicForGamesHeader.title}</SubHeading>
                    <Subtitle darkText={darkText}>{musicForGamesHeader.description}</Subtitle>
                    <IconWrap>
                        <Icon src={musicForGamesHeader.img} alt={musicForGamesHeader.alt}/>
                    </IconWrap>
                </SubHeadingWrap>
                <SubHeadingWrap>
                    <SubHeading>{uniquenessHeader.title}</SubHeading>
                    <Subtitle darkText={darkText}>{uniquenessHeader.description}</Subtitle>
                    <IconWrap>
                        <Icon src={uniquenessHeader.img} alt={uniquenessHeader.alt}/>
                    </IconWrap>
                </SubHeadingWrap>
                <SubHeadingWrap>
                    <SubHeading>{customizableHeader.title}</SubHeading>
                    <Subtitle darkText={darkText}>{customizableHeader.description}</Subtitle>
                    <IconWrap>
                        <Icon src={customizableHeader.img} alt={alt}/>
                    </IconWrap>
                </SubHeadingWrap>
                <BtnWrap>
                    <ButtonL to='home'
                    smooth={true}
                    duration={500}
                    spy={true}
                    exact="true"
                    offset={-60}
                    primary={primary ? 1 : 0}
                    dark={dark ? 0 : 1}
                    dark2 ={dark2 ? 1 : 0}
                    big={true}
                    >{buttonLabel}</ButtonL>
                </BtnWrap>
            </TextWrapper>
        </InfoWrapper>
      </InfoContainer>
  )
}

export default InfoSectionAbout
