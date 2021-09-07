import React, { useEffect, useState } from 'react';
import InputSliderZoomedView from './InputSliderZoomedView';
import RecipientInfo from './RecipientInfo';
import { parseSliderStartingValue } from './utils';

function RecipientSlide() {
    const [recipientId, setRecipientId] = useState(1);
    const [startingValue, setStartingValue] = useState(parseSliderStartingValue(recipientId));

    useEffect(() => {
        const newStartingValue = parseSliderStartingValue(recipientId);
        setStartingValue(newStartingValue);
    }, [recipientId]);

    const handleSwitchToNextRecipient = () => {
        const roomInfo = JSON.parse(sessionStorage.getItem('roomInfo'));
        const recipientIds = roomInfo.recipients.map((recipientData) => {
            return recipientData.recipient_id;
        });
        const indexCurrent = recipientIds.findIndex((el) => el === recipientId);
        let indexNext;
        if (indexCurrent === recipientIds.length - 1) {
            indexNext = 0;
        } else {
            indexNext = indexCurrent + 1;
        }
        setRecipientId(recipientIds[indexNext]);
    };

    return (
        <div>
            <button onClick={handleSwitchToNextRecipient}>Next Recipient</button>
            <InputSliderZoomedView sliderId={recipientId} startingValue={startingValue} />
            <RecipientInfo recipientId={recipientId} />
        </div>
    );
}

export default RecipientSlide;
