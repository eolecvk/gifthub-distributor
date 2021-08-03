import React from 'react'
import { Container, Modal } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import ToggleButtonsUpDown from './ToggleButtonsUpDown'

function DissentModal(props) {

    const useStyles = makeStyles((theme) => ({
        paper: {
            position: 'absolute',
            top: 50,
            left: 50,
            width: 220,
            height: 220,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }));
    const [open, setOpen] = React.useState(props.modalOpen);

    const handleClose = () => {
        setOpen(false);
        console.log("closing")
    };

    console.log("Hola que tal")
    const classes = useStyles();
    
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            <div className={classes.paper}>
                <ToggleButtonsUpDown
                    key={props.userId}
                    sliderId={props.userId} />
            </div>
        </Modal >
    )
}

export default DissentModal