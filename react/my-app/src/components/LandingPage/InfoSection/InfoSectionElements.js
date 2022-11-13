import styled from 'styled-components'

export const InfoContainer = styled.div`
    color: #fff;
    background: ${({lightBg}) => (lightBg ? '#f9f9f9' : '#07040C')};
    height: 980px;
    width: 100%;

    @media screen and (max-width: 768px) {
        padding: 0 50px;
    }
`;

export const InfoWrapper = styled.div`
    z-index: 2;
    width: 100%;
    height: 100%;
    align-items: center;
`;

export const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 740px;
    margin: auto;
    padding-top: 80px;
    padding-bottom: 60px;
    justify-content: center;
    justify-self: center;
    align-items: center;
    padding: auto;
`;

export const Heading = styled.h1`
    justify-self: center;
    text-align: center;
    color: #000;
    margin-bottom: 78px;
    font-size: min(5vw, 48px);
    line-height: 1.1;
    font-weight: 600;
    color: ${({lightText}) => (lightText ? '#f7f8fa' : '#010606')};

    @media screen and (max-width: 480px) {
        font-size: 20px;
    }
`;

export const SubHeadingWrap = styled.div`
    width: 100%;
    height: 100px;
    margin-bottom: 64px;
`;

export const SubHeading = styled.h2`
    text-align: ${({centerAlign}) => (centerAlign ? 'center' : 'left')};
    color: #000;
    margin-bottom: 12px;
    font-size: ${({large}) => (large ? 'min(7vw, 50px)' : 'min(3.5vw, 32px)')};
    line-height: 1.1;
    font-weight: 600;
    color: ${({lightText}) => (lightText ? '#f7f8fa' : '#010606')};

    @media screen and (max-width: 480px) {
        font-size: 20px;
    }
`;

export const Subtitle = styled.p`
    text-align: ${({centerAlign}) => (centerAlign ? 'center' : 'left')};
    height: 100%;
    font-size: min(3.5vw, 24px);
    font-size: ${({large}) => (large ? 'min(5vw, 34px)' : 'min(3.5vw, 24px)')};
    font-weight: 100;
    line-height: 32px;
    color: ${({darkText}) => (darkText ? '#2D2D2D' : '#fff')};
`;

export const BtnWrap = styled.div`
    margin-top: 40px;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 50px;
`;

export const IconWrap = styled.div`
    position: relative;
    max-width: 90px;
    height: 100%;
    align-items: center;

    @media screen and (max-width: 900px) {
        display: none;
    }
`;

export const Icon = styled.img`
    position: absolute;
    top: -135%;
    left: -115%;
    width: 90%;
    background: #DCDCDC60;
    border-radius: 9px;
`;

export const SubHeadingWrapSmall = styled.div`
    width: 100%;
    height: 120px;
    margin-bottom: 32px;
    line-height: 2em; /* 1em = 12px in this case. 20/12 == 1.666666  */
`;
