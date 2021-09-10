import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Container } from '@material-ui/core';
import ToggleButtonsUpDown from './ToggleButtonsUpDown';
import EditRecipientModal from './EditRecipientModal';

function RecipientInfo(props) {
    const { recipientId } = props;
    const roomInfo = JSON.parse(sessionStorage.getItem('roomInfo'));
    const voterId = sessionStorage.getItem('voterId');

    const recipientData =
        recipientId === ''
            ? ''
            : roomInfo.recipients.filter((el) => {
                  return el.recipient_id === parseInt(recipientId);
              })[0];

    const textBody =
        `Recipient: ${recipientData.name}\n` +
        `Survive: ${recipientData.needs_lower_bound_cents / 100}$\n` +
        `Thrive: ${recipientData.needs_upper_bound_cents / 100}$`;

    let needsDescription;

    try {
        needsDescription = recipientData.needs_description;
        if (needsDescription !== '') {
            needsDescription = (
                <Grid item>
                    <p style={{ marginTop: 10 + 'px' }}>Needs description:</p>
                    <p
                        style={{
                            width: 300 + 'px',
                            maxHeight: 300 + 'px',
                            whiteSpace: 'pre-line',
                            overflow: 'scroll',
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
    } catch {
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

    const body =
        recipientId === '' ? (
            <div />
        ) : (
            <Grid container direction="column" style={{ whiteSpace: 'pre-line' }}>
                {dissentButtons}
                <Grid item xs zeroMinWidth>
                    {textBody}
                </Grid>
                {needsDescription}
                <Grid>
                    <EditRecipientModal recipientId={recipientId} roomInfo={roomInfo} />
                </Grid>
            </Grid>
        );

    return body;
}

export default RecipientInfo;
