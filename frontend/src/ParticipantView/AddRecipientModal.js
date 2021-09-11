import React from 'react';
import { Grid, Container } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AddRecipientForm from './AddRecipientForm';
import CustomButton from '../CustomButton';
import CustomModal from '../CustomModal';
import './AddRecipientModal.css';

function AddRecipientModal(props) {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const body = <AddRecipientForm handleClose={handleClose} roomCode={props.roomCode} />;

    return (
        <div>
            <Grid container alignItems="center" justifyContent="center" style={{ marginTop: 40 }}>
                {' '}
                <CustomButton
                    title="Add recipient"
                    startIcon={<AddCircleOutlineIcon />}
                    size="large"
                    onClick={() => handleOpen()}
                />
            </Grid>

            <Container>
                <CustomModal
                    show={open}
                    handleClose={handleClose}
                    form={body}
                    title="New recipient"
                />
            </Container>
        </div>
    );
}

export default AddRecipientModal;
