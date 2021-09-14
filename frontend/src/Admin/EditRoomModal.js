import React from 'react';
import { Container } from '@material-ui/core';
import EditRoomForm from './EditRoomForm';
import CustomButton from '../CustomButton';
import CustomModal from '../CustomModal';
import EditIcon from '@material-ui/icons/Edit';

function EditRoomModal(props) {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <CustomButton
                title="Edit room config"
                startIcon={<EditIcon />}
                size="medium"
                onClick={handleOpen}
            />
            <Container>
                <CustomModal
                    title="Edit Room Info"
                    form={<EditRoomForm handleClose={handleClose} roomCode={props.roomCode} />}
                    show={open}
                    handleClose={handleClose}
                />
            </Container>
        </div>
    );
}

export default EditRoomModal;
