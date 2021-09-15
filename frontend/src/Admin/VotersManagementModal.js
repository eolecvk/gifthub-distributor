import React from 'react';
import CustomModal from '../CustomModal';
import VotersManagementForm from './VotersManagementForm';

function VotersManagementModal(props) {
    const { roomCode, show } = props;

    const [open, setOpen] = React.useState(show);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <CustomModal
            title="Manage Voters"
            form={<VotersManagementForm roomCode={roomCode} />}
            show={open}
            handleClose={handleClose}
        />
    );
}

export default VotersManagementModal;
