import React, { useEffect } from 'react';
import { Container, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ToggleButtonsUpDown from './ToggleButtonsUpDown';

function DissentModal(props) {
    const { dissentModalOpenAtSlider, handleClose } = props;
    const [openAtSlider, setOpenAtSlider] = React.useState(dissentModalOpenAtSlider);

    useEffect(() => {
        setOpenAtSlider(dissentModalOpenAtSlider);
    }, [dissentModalOpenAtSlider]);

    const useStyles = makeStyles((theme) => ({
        paper: {
            // position: 'absolute',
            // top: 50,
            // left: 50,
            position: 'absolute',
            top: 40 + '%',
            left: 12 + '%',
            transform: 'translateY(' + -50 + '%), translateX(' + -50 + '%)',
            margin: 'auto',
            //display: 'flex',
            justifyContent: 'center',
            verticalAlign: 'middle',
            width: 100,
            height: 100,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(3, 4, 3),
        },
    }));

    const classes = useStyles();
    const roomInfo = JSON.parse(sessionStorage.getItem('roomInfo'));
    const userName =
        openAtSlider === ''
            ? ''
            : roomInfo.people.filter((el) => {
                  return el.person_id === parseInt(openAtSlider);
              })[0].name;

    const body =
        openAtSlider === '' ? (
            <div />
        ) : (
            <div className={classes.paper}>
                <h3>{userName}</h3>
                <ToggleButtonsUpDown key={openAtSlider} sliderId={openAtSlider} />
            </div>
        );

    return (
        <div>
            <Container>
                <Modal
                    open={openAtSlider !== '' ? true : false}
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

export default DissentModal;
