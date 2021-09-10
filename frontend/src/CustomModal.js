import React from 'react';
import { Container, Modal } from '@material-ui/core';
import './CustomModal.css';

function CustomModal(props) {
    const { form, title, show, handleClose } = props;

    const content = (
        <div className="modal-content">
            <h3 className="modal-title">{title}</h3>
            <div className="modal-body">{form}</div>
        </div>
    );

    return (
        <Modal
            className="modal"
            open={show}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {content}
        </Modal>
    );
}

export default CustomModal;
