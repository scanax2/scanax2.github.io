import styled from 'styled-components'

export const GeneratorInputWrapper = styled.div`
padding-left: 120px;
padding-right: 120px;
margin-top: 50px;
align-items: center;
`;

export const GeneratorInputRow = styled.div`
display: flex;
justify-content: space-around;
align-items: center;
margin-bottom: 15px;

@media screen and (max-width: 720px) {
    display: grid;
    height: 500px;
}
`;

export const GeneratorSettingsWrapper = styled.div`
width: 600px;
display: flex;
justify-content: center;
align-items: center;
padding: 5px;

@media screen and (max-width: 720px) {
    width: 80vw;
    display: grid;
    height: 250px;
}
`;

export const BtnWrapper = styled.div`
border-radius: 9px;
margin: 10px;
font-size: 24px;
width: 600px;
min-width: 200px;
background: ${props => props.background};

@media screen and (max-width: 720px) {
    width: 80vw;
    display: grid;
}
`;

export const SmallBtnWrapper = styled.div`
border-radius: 20px;
font-size: 24px;
width: 100px;
height: 30px;
min-width: 50px;
background: ${props => props.background};

@media screen and (max-width: 720px) {
    width: 50vw;
    display: grid;
}
`;

export const DropdownWrapper = styled.div`
margin-left: 10px;
margin-right: 10px;
margin-top: -20px;
width: 600px;
display: flex;
flex-direction: row;
min-width: 200px;

@media screen and (max-width: 720px) {
    width: 80vw;
    flex-direction: column;
}
`;