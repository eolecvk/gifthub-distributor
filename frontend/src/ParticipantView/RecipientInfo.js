import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import ToggleButtonsUpDown from './ToggleButtonsUpDown';
import EditRecipientModal from './EditRecipientModal';
import { formatAsUSD } from '../utils';

function RecipientInfo(props) {
    const { recipientId, closeRecipientModal } = props;
    const [roomInfo, setRoomInfo] = useState(JSON.parse(sessionStorage.getItem('roomInfo')));

    const refreshRoomInfo = () => {
        setRoomInfo(JSON.parse(sessionStorage.getItem('roomInfo')));
    };

    useEffect(() => {
        const interval = setInterval(refreshRoomInfo, 300);
        return () => clearInterval(interval);
    }, []);

    const voterId = sessionStorage.getItem('voterId');

    const recipientData =
        recipientId === ''
            ? ''
            : roomInfo.recipients.filter((el) => {
                  return el.recipient_id === parseInt(recipientId);
              })[0];

    if (!recipientData) {
        return null;
    }

    const textBody =
        `Recipient: ${recipientData.name}\n` +
        `Current amount: ${formatAsUSD(recipientData.avg_cents / 100)}\n` +
        `Survive amount: ${formatAsUSD(recipientData.needs_lower_bound_cents / 100)}\n` +
        `Thrive amount: ${formatAsUSD(recipientData.needs_upper_bound_cents / 100)}`;

    let needsDescription = recipientData.needs_description;

    if (needsDescription) {
        needsDescription = (
            <Grid item style={{ width: 100 + '%' }}>
                <p style={{ marginTop: 10 + 'px' }}>Needs description:</p>
                <p
                    style={{
                        maxHeight: 300 + 'px',
                        whiteSpace: 'pre-line',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        wordWrap: 'break-word',
                    }}
                >
                    {needsDescription}
                </p>
            </Grid>
        );
    } else {
        needsDescription = null;
    }

    const dissentButtons = voterId ? (
        <ToggleButtonsUpDown
            key={recipientId}
            recipientId={recipientId}
            voterId={parseInt(voterId)}
            roomCode={roomInfo.room_code}
        />
    ) : null;

    return (
        <Grid container direction="column" item style={{ whiteSpace: 'pre-line' }}>
            {dissentButtons}
            <Grid item xs zeroMinWidth style={{ marginTop: 15 + 'px', wordWrap: 'break-word' }}>
                {textBody}
            </Grid>
            {needsDescription}
            <Grid>
                <EditRecipientModal
                    recipientId={recipientId}
                    roomInfo={roomInfo}
                    closeRecipientModal={closeRecipientModal}
                />
            </Grid>
        </Grid>
    );
}

export default RecipientInfo;
