import React, {useState} from 'react'
import Modal from "react-modal";
import { ModalWrapper} from './GeneratorFileDialogElements'
import './modalStyle.css'

const GeneratorFileDialog = () => {

    const [isOpen, setIsOpen] = useState(false);

    function toggleModal() {
        console.log('try open')
        setIsOpen(!isOpen);
    }

    return (
        <>
            <button onClick={toggleModal}>Open modal</button>

            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel="My dialog"
                className="mymodal"
                overlayClassName="myoverlay"
                closeTimeoutMS={500}
            >
                <div>My modal dialog.</div>
                <button onClick={toggleModal}>Close modal</button>
            </Modal>
        </>
    )
}

export default GeneratorFileDialog
