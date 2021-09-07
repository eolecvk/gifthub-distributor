import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ToggleButtonsUpDown from './ToggleButtonsUpDown';
import EditRecipientModal from './EditRecipientModal';

function RecipientInfo(props) {
    const { recipientId, handleClose } = props;

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

    const recipientData =
        recipientId === ''
            ? ''
            : roomInfo.recipients.filter((el) => {
                  return el.recipient_id === parseInt(recipientId);
              })[0];

    let textBody =
        `Name: ${recipientData.name}\n` +
        `Survive: ${recipientData.needs_lower_bound_cents / 100}$\n` +
        `Thrive: ${recipientData.needs_upper_bound_cents / 100}$`;

    if (recipientData.needs_description && recipientData.needs_description !== '') {
        textBody += `\n\n"${recipientData.needs_description}"`;
    }

    const voterId = sessionStorage.getItem('voterId');

    let dissentButtons;
    if (voterId) {
        dissentButtons = (
            <ToggleButtonsUpDown
                key={recipientId}
                recipientId={recipientId}
                voterId={parseInt(voterId)}
                roomCode={roomInfo.room_code}
            />
        );
    }

    const body =
        recipientId === '' ? (
            <div />
        ) : (
            <div className={classes.paper}>
                {dissentButtons}
                <div style={{ whiteSpace: 'pre-line' }}>{textBody}</div>
                <EditRecipientModal
                    recipientId={recipientId}
                    roomInfo={roomInfo}
                    //handleCloseRecipientModal={handleClose} Not applicable
                />
            </div>
        );

    return body;
}

export default RecipientInfo;
