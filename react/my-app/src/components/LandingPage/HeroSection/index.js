import React, {useState} from 'react'
import { ButtonR } from '../../ButtonElements'
import { 
    HeroBg, 
    HeroContainer, 
    ImageBg,
    HeroContent,
    HeroH1,
    HeroH2,
    HeroH3,
    HeroBtnWrapper,
    ArrowForward,
    ArrowRight,
    VideoBg
} from './HeroElements'
import video from '../../../videos/video.mp4'

const HeroSection = () => {

    const [hover, setHover] = useState(false)

    const onHover = () => {
        setHover(!hover)
    }

    return (
    <>
        <HeroContainer id="home">
            <HeroBg>
                <VideoBg autoPlay loop muted src={video} type='video/mp4'/>
            </HeroBg>
            <HeroContent>
                <HeroH2>Create your own</HeroH2>
                <HeroH1>Royalty Free Music</HeroH1>
                <HeroH3>With Game Music Generator</HeroH3>
                <HeroBtnWrapper>
                    <ButtonR to='/music-generator' onMouseEnter={onHover} onMouseLeave={onHover} primary="true" dark="true">
                    Try now for FREE {hover ? <ArrowForward /> : <ArrowRight/>}
                    </ButtonR>
                </HeroBtnWrapper>
            </HeroContent>
        </HeroContainer>
    </>
    )
}

export default HeroSection
