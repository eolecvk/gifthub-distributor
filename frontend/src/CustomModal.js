import React from 'react';
import { Container, Modal } from '@material-ui/core';
import './CustomModal.css';

function CustomModal(props) {
    const { form, modalTitle, show, handleClose } = props;

    const content = (
        <div className="modal-content">
            <h3 className="modal-title">{modalTitle}</h3>
            <div className="modal-body">{form}</div>
        </div>
    );

    return (
        <div>
            <Container>
                <Modal
                    className="modal"
                    open={show}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {content}
                </Modal>
            </Container>
        </div>
    );
}

export default CustomModal;
