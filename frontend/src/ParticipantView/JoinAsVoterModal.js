import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
// import Modal from '@material-ui/core/Modal';
import JoinAsVoterForm from './JoinAsVoterForm';
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

    //const classes = useStyles();

    return (
        // <div className={classes.root}>
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
