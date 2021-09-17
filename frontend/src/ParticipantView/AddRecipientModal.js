import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AddRecipientForm from './AddRecipientForm';
import CustomButton from '../CustomButton';
import CustomModal from '../CustomModal';
import './AddRecipientModal.css';

function AddRecipientModal(props) {
    const { show, handleCloseModal, handleOpenModal } = props;
    const [open, setOpen] = React.useState(show);

    useEffect(() => {
        setOpen(show);
    }, [show]);

    const addRecipientButton = (
        <Grid container alignItems="center" justifyContent="center" style={{ marginTop: 40 }}>
            <CustomButton
                title="Add recipient"
                startIcon={<AddCircleOutlineIcon />}
                size="large"
                onClick={handleOpenModal}
            />
        </Grid>
    );

    const addRecipientModal = (
        <CustomModal
            show={open}
            handleClose={handleCloseModal}
            form={<AddRecipientForm handleClose={handleCloseModal} roomCode={props.roomCode} />}
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
