import styled from 'styled-components'

export const ExtraInfoContainer = styled.div`
    align-items: center;
    justify-self: center;
`;

export const ExtraInfoTextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 1280px;
    margin: auto;
    padding-top: 100px;
    padding-bottom: 60px;
    justify-content: center;
    justify-self: center;
    align-items: center;
    padding: auto;
    white-space: pre-line;
`;

export const SocialIcons = styled.div`
    padding-top: 50px;
    max-width: 1280px;
    padding: auto;
    margin: auto;
    justify-content: center;
    justify-self: center;
    align-items: center;
`;

export const SocialIconWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    margin: auto;
    justify-content: flex-start;
    justify-self: center;
    align-items: center;
    padding: auto;
    text-align: center;
`;

// Link off a website then .a
export const SocialIconLink = styled.a`
    color: #fff;
    font-size: 24px;
    margin: 25px;
`;