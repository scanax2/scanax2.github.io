import React, {useState} from 'react'
import {
    DropDownContainer,
    DropDownHeader,
    DropDownListContainer,
    DropDownList,
    ListItem,
    ArrowDown
} from './GeneratorEnumDropdownElements'

const GeneratorEnumDropdown = ({options}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options[0]);

    const toggling = () => setIsOpen(!isOpen);

    const onOptionClicked = value => () => {
        setSelectedOption(value);
        setIsOpen(false);
        console.log(selectedOption);
    };

    const [hover, setHover] = useState(false)

    const onHover = () => {
        if (isOpen && hover==true){
            toggling()
        }
        setHover(!hover)
    }

    return (
        <DropDownContainer onMouseEnter={onHover} onMouseLeave={onHover}>
            <DropDownHeader onClick={toggling}>
                {selectedOption} <ArrowDown />
            </DropDownHeader>
            {isOpen && (
            <DropDownListContainer onMouseLeave={toggling}>
                <DropDownList>
                {options.map(option => (
                    <ListItem onClick={onOptionClicked(option)} key={Math.random()}>
                    {option}
                    </ListItem>
                ))}
                </DropDownList>
            </DropDownListContainer>
            )}
        </DropDownContainer>
    )
}

export default GeneratorEnumDropdown
