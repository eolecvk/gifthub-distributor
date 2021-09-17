import React from 'react';
import { Grid } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AddRecipientForm from './AddRecipientForm';
import CustomButton from '../CustomButton';
import CustomModal from '../CustomModal';
import './AddRecipientModal.css';

function AddRecipientModal(props) {
    const { show, handleCloseModal } = props;
    const [open, setOpen] = React.useState(show);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        handleCloseModal();
        setOpen(false);
    };

    const addRecipientButton = (
        <Grid container alignItems="center" justifyContent="center" style={{ marginTop: 40 }}>
            <CustomButton
                title="Add recipient"
                startIcon={<AddCircleOutlineIcon />}
                size="large"
                onClick={handleOpen}
            />
        </Grid>
    );

    const addRecipientModal = (
        <CustomModal
            show={open}
            handleClose={handleClose}
            form={<AddRecipientForm handleClose={handleClose} roomCode={props.roomCode} />}
            title="New recipient"
        />
    );

    return (
        <div>
            {addRecipientButton}
            {addRecipientModal}
        </div>
    );
}

export default AddRecipientModal;
