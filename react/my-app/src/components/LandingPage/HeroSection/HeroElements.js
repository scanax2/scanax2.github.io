import styled from 'styled-components'
import img from '../../../images/LangingPageBackground.jpg'
import {MdArrowForward, MdKeyboardArrowRight} from 'react-icons/md'

export const HeroContainer = styled.div`
    background: #0c0c0c;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 30px;
    height: 1080px;
    position: relative;
    z-index: 1;

    :before{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%),
        linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 100%);
        z-index: 2;
    }
`;

export const HeroBg = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    border: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

export const ImageBg = styled.div`
    background-image: url(${img});
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
`;

export const VideoBg = styled.video`
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    background: #232a34;
`;

export const HeroContent = styled.div`
    z-index: 3;
    max-width: 1200px;
    position: absolute;
    padding: 8px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 100px;
`;

export const HeroH1 = styled.h1`
    color: #fff;
    font-size: min(5vw, 65px);
    text-align: center;
    max-width: 1000px;

    @media screen and (max-width: 768px) {
        font-size: 40px;
    }

    @media screen and (max-width: 480px) {
        font-size: 32px;
    }
`;

export const HeroH2 = styled.h2`
    margin-top: 24px;
    margin-bottom: 12px;
    color: #fff;
    font-size: min(3.2vw, 40px);
    text-align: center;
    max-width: 500px;

    @media screen and (max-width: 768px) {
        font-size: 26px;
    }

    @media screen and (max-width: 480px) {
        font-size: 20px;
    }
`;

export const HeroH3 = styled.h2`
    margin-top: 72px;
    margin-bottom: 12px;
    color: #fff;
    font-size: min(3.2vw, 40px);
    text-align: center;
    max-width: 650px;

    @media screen and (max-width: 768px) {
        font-size: 26px;
    }

    @media screen and (max-width: 480px) {
        font-size: 20px;
    }
`;

export const HeroBtnWrapper = styled.div`
    margin-top: 125px;
    margin-left: 8px;
    font-size: 20px;
    font-weight: bold;
    width: 80%;
`;

export const ArrowForward = styled(MdArrowForward)`
    margin-left: 8px;
    font-size: 20px;
`;

export const ArrowRight = styled(MdKeyboardArrowRight)`
    margin-left: 8px;
    font-size: 20px;
`;