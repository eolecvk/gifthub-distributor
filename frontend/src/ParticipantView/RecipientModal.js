import React, { useEffect } from 'react';
import { Container, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ToggleButtonsUpDown from './ToggleButtonsUpDown';
import EditableInfoModal from './EditRecipientModal'
import EditRecipientModal from './EditRecipientModal'


function RecipientModal(props) {
    const { recipientId, handleClose } = props;
    const [openAtSlider, setOpenAtSlider] = React.useState(recipientId);

    useEffect(() => {
        setOpenAtSlider(recipientId);
    }, [recipientId]);

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
            width: 200,
            height: 300,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(3, 4, 3),
        },
    }));

    const classes = useStyles();
    const roomInfo = JSON.parse(sessionStorage.getItem('roomInfo'));
    
    const recipientData = openAtSlider === ''
        ? ''
        : roomInfo.recipients.filter((el) => {
            return el.recipient_id === parseInt(openAtSlider);
        })[0]


    let textBody = `Survive: ${recipientData.needs_lower_bound_cents / 100}$\n` +
        `Thrive: ${recipientData.needs_upper_bound_cents / 100}$`;
    if (recipientData.needs_description && recipientData.needs_description !== '') {
        textBody += `\n\n"${recipientData.needs_description}"`;
    }

    const body =
        openAtSlider === '' ? (
            <div />
        ) : (
            <div className={classes.paper}>
                <ToggleButtonsUpDown key={openAtSlider} sliderId={openAtSlider} />
                <div style={{ whiteSpace: 'pre-line' }}>{textBody}</div>
                <EditRecipientModal
                    recipientId={recipientId}
                    handleCloseRecipientModal={handleClose}
                />
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

export default RecipientModal;
