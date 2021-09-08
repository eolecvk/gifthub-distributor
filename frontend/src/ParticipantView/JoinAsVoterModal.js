import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Modal from '@material-ui/core/Modal';
import JoinAsVoterForm from './JoinAsVoterForm';

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

    const classes = useStyles();
    const body = (
        <div className={classes.paper}>
            <h3 id="simple-modal-title">Join as voter</h3>
            <JoinAsVoterForm handleClose={handleClose} roomCode={props.roomCode} />
        </div>
    );

    return (
        <div className={classes.root}>
            <button id="joinAsVoter-button" onClick={() => handleOpen()}>
                Join as voter
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

export default JoinAsVoterModal;
