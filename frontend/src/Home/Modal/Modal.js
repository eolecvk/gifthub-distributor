import React from 'react';
import { Container, Modal } from '@material-ui/core';
import CreateRoomForm from '../Form/CreateRoomForm';
import JoinRoomForm from '../Form/JoinRoomForm';
import './Modal.css';

function HomeModal(props) {
    const form =
        props.modalTitle === 'Create Room' ? (
            <CreateRoomForm handleClose={props.handleClose} />
        ) : (
            <JoinRoomForm handleClose={props.handleClose} />
        );

    const body = (
        <div className="modal-content">
            <h3 className="modal-title">{props.modalTitle}</h3>
            <div className="modal-body">{form}</div>
        </div>
    );

    return (
        <div>
            <Container>
                <Modal
                    className="modal"
                    open={props.show}
                    onClose={props.handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body}
                </Modal>
            </Container>
        </div>
    );
}

export { HomeModal };
