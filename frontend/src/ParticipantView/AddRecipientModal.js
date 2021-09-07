import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Modal from '@material-ui/core/Modal';
import AddRecipientForm from './AddRecipientForm';
import './AddRecipientModal.css';

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

function AddRecipientModal(props) {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const classes = useStyles();
    const body = (
        <div className={classes.paper}>
            <h3 id="simple-modal-title">Add new recipient</h3>
            <AddRecipientForm handleClose={handleClose} roomCode={props.roomCode} />
        </div>
    );

    return (
        <div className={classes.root}>
            <button id="addRecipient-button" onClick={() => handleOpen()}>
                <svg version="1.1" id="undo-icon" x="0px" y="0px" viewBox="0 0 26.676 26.676">
                    <path
                        d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2
                    12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41
                    0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                    ></path>
                </svg>
            </button>
            <Container>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body}
                </Modal>
            </Container>
        </div>
    );
}

export default AddRecipientModal;
