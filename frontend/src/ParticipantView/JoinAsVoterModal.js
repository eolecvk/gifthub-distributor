import React from 'react';
import { Container } from '@material-ui/core';
import JoinAsVoterForm from './JoinAsVoterForm';
import CustomButton from '../CustomButton';
import CustomModal from '../CustomModal';

function JoinAsVoterModal(props) {
    let openOnStart = false;
    if (sessionStorage.getItem('entryPoint') === 'link') {
        openOnStart = true;
    }
    const [open, setOpen] = React.useState(openOnStart);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        sessionStorage.setItem('entryPoint', '');
        setOpen(false);
    };

    return (
        <div>
            <CustomButton title="Join as voter" onClick={handleOpen} />
            <Container>
                <CustomModal
                    title="Join as voter"
                    form={<JoinAsVoterForm handleClose={handleClose} roomCode={props.roomCode} />}
                    show={open}
                    handleClose={handleClose}
                />
            </Container>
        </div>
    );
}

export default JoinAsVoterModal;
