import React, {useState} from 'react'
import Modal from "react-modal";
import { 
    ModalContentWrapper,
    ModalHeader,
    ModalDescription,
    FileInputWrapper,
    ModalButtonWrapper
} from './GeneratorFileDialogElements'
import './modalStyle.css'
import { Button } from '../../ButtonElements'
import { updateTrackDisplay, updateEditorTrack } from '../UpdateMusicPlayers';

const GeneratorFileDialog = ({isOpen, toggleModal, toggleSampleState}) => {

    const createSample = () => {
        toggleModal()
        toggleSampleState("ProcessingSample")
        updateTrackDisplay()
        updateEditorTrack()
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel="My dialog"
                className="mymodal"
                overlayClassName="myoverlay"
                closeTimeoutMS={500}
            >
                <ModalContentWrapper>
                    <ModalHeader>Add sample</ModalHeader>
                    <ModalDescription>Sample will be used as start of your song, model will generate similar continuation. Choose file .mid or create your own sample.</ModalDescription>
                    <FileInputWrapper>
                        <input id="midi_file_input" type="file" accept=".mid,.midi"/>
                    </FileInputWrapper>
                    <ModalButtonWrapper>
                        <Button dark={true} fontBig={true} onClick={createSample}>Create sample</Button>
                    </ModalButtonWrapper>
                </ModalContentWrapper>
            </Modal>
        </>
    )
}

export default GeneratorFileDialog
