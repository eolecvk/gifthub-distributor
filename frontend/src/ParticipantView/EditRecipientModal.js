import React from 'react';
import { Grid, Container } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import EditRecipientForm from './EditRecipientForm';
import { registerRecipientUpdate } from './utils';
import CustomButton from '../CustomButton';
import CustomModal from '../CustomModal';
import './EditRecipientModal.css';

function EditRecipientModal(props) {
    const { recipientId, roomInfo, closeRecipientModal } = props;
    const [open, setOpen] = React.useState(false);

    const handleSubmit = (newUsername, newSurviveAmount, newThriveAmount, newNeedsDescription) => {
        const args = {
            roomCode: props.roomInfo.room_code,
            recipientId: props.recipientId,
            username: newUsername,
            needsLowerBoundCents: newSurviveAmount * 100,
            needsUpperBoundCents: newThriveAmount * 100,
            needsDescription: newNeedsDescription,
        };
        registerRecipientUpdate(args);
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleCloseEditRecipientModal = () => {
        setOpen(false);
    };

    return (
        <div>
            <Grid container alignItems="center" justifyContent="flex-end" style={{ marginTop: 20 }}>
                <CustomButton
                    title="Edit info"
                    startIcon={<EditIcon />}
                    size="medium"
                    onClick={handleOpen}
                />
            </Grid>
            <Container>
                <CustomModal
                    title="Edit Recipient Info"
                    show={open}
                    handleClose={handleCloseEditRecipientModal}
                    form={
                        <EditRecipientForm
                            roomInfo={roomInfo}
                            recipientId={recipientId}
                            handleSubmit={handleSubmit}
                            handleCloseEditRecipientModal={handleCloseEditRecipientModal}
                            closeRecipientModal={closeRecipientModal}
                        />
                    }
                />
            </Container>
        </div>
    );
}

export default EditRecipientModal;
