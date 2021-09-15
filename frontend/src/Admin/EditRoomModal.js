import React from 'react';
import EditRoomForm from './EditRoomForm';
import CustomModal from '../CustomModal';

function EditRoomModal(props) {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <CustomModal
            title="Edit Room Info"
            form={<EditRoomForm handleClose={handleClose} roomCode={props.roomCode} />}
            show={open}
            handleClose={handleClose}
        />
    );
}

export default EditRoomModal;
