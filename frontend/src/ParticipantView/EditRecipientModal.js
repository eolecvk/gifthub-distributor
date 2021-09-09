import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Tooltip, Container } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import EditRecipientForm from './EditRecipientForm';
import { registerRecipientUpdate } from './utils';
import './EditRecipientModal.css';
import CustomButton from '../CustomButton';
import CustomModal from '../CustomModal';

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        top: 25 + '%',
        left: 12 + '%',
        transform: 'translateY(' + -50 + '%), translateX(' + -50 + '%)',
        margin: 'auto',
        justifyContent: 'center',
        verticalAlign: 'middle',
        width: 220,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(3, 4, 3),
    },
}));

function EditRecipientModal(props) {
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

    const handleCloseRecipientModal = () => {
        props.handleCloseRecipientModal();
    };

    // const classes = useStyles();
    // const body = (
    //     <div className={classes.paper}>
    //         <h3 id="simple-modal-title">Edit info</h3>
    //         <EditRecipientForm
    //             roomInfo={props.roomInfo}
    //             roomCode={props.roomInfo.room_code}
    //             recipientId={props.recipientId}
    //             handleSubmit={handleSubmit}
    //             handleCloseEditRecipientModal={handleCloseEditRecipientModal}
    //             handleCloseRecipientModal={handleCloseRecipientModal}
    //         />
    //     </div>
    // );

    return (
        // <div className={classes.root}>
        <div>
            {/* <Tooltip title="Edit recipient info">
                <button id="edit-button">
                    <svg
                        className="MuiSvgIcon-root jss82 MuiSvgIcon-fontSizeLarge"
                        focusable="false"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        title="fontSize large"
                        onClick={handleOpen}
                    >
                        <path
                            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02
                        0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                        ></path>
                    </svg>
                </button>
            </Tooltip> */}
            <Grid container alignItems="center" justifyContent="flex-end" style={{ marginTop: 20 }}>
                <CustomButton
                    title="Edit info"
                    startIcon={<EditIcon />}
                    size="medium"
                    onClick={handleOpen}
                />
            </Grid>

            <Container>
                {/* <Modal
                    open={open}
                    onClose={handleCloseEditRecipientModal}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body}
                </Modal> */}

                <CustomModal
                    title="Edit Recipient Info"
                    show={open}
                    handleClose={handleCloseEditRecipientModal}
                    form={
                        <EditRecipientForm
                            roomInfo={props.roomInfo}
                            recipientId={props.recipientId}
                            handleSubmit={handleSubmit}
                            handleCloseEditRecipientModal={handleCloseEditRecipientModal}
                            handleCloseRecipientModal={handleCloseRecipientModal}
                        />
                    }
                />
            </Container>
        </div>
    );
}

export default EditRecipientModal;
