import React, {useState} from 'react'
import { Button } from '../ButtonElements'
import { 
    HeroBg, 
    HeroContainer, 
    ImageBg,
    HeroContent,
    HeroH1,
    HeroH2,
    HeroBtnWrapper,
    ArrowForward,
    ArrowRight
} from './HeroElements'

const HeroSection = () => {

    const [hover, setHover] = useState(false)

    const onHover = () => {
        setHover(!hover)
    }

    return (
    <>
        <HeroContainer id="home">
            <HeroBg>
                <ImageBg />
            </HeroBg>
            <HeroContent>
                <HeroH2>Create your own</HeroH2>
                <HeroH1>Royalty Free Music</HeroH1>
                <HeroBtnWrapper>
                    <Button to='/generate_music' onMouseEnter={onHover} onMouseLeave={onHover} primary="true" dark="true">
                    Try now for FREE {hover ? <ArrowForward /> : <ArrowRight/>}
                    </Button>
                </HeroBtnWrapper>
            </HeroContent>
        </HeroContainer>
    </>
    )
}

export default HeroSection
