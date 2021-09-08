import React, { useEffect, useState } from 'react';
import InputSliderZoomedView from './InputSliderZoomedView';
import RecipientInfo from './RecipientInfo';
import { parseSliderStartingValue } from './utils';

function RecipientSlide() {
    const [recipientId, setRecipientId] = useState(1);
    //const [startingValue, setStartingValue] = useState(parseSliderStartingValue(recipientId));
    let startingValue = parseSliderStartingValue(recipientId)

    useEffect(() => {
        const newStartingValue = parseSliderStartingValue(recipientId);
        //setStartingValue(newStartingValue);
        startingValue = newStartingValue
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

    const handleSwitchToPreviousRecipient = () => {
        const roomInfo = JSON.parse(sessionStorage.getItem('roomInfo'));
        const recipientIds = roomInfo.recipients.map((recipientData) => {
            return recipientData.recipient_id;
        });
        const indexCurrent = recipientIds.findIndex((el) => el === recipientId);
        let indexPrev;
        if (indexCurrent === 0) {
            indexPrev = recipientIds.length - 1;
        } else {
            indexPrev = indexCurrent - 1;
        }
        setRecipientId(recipientIds[indexPrev]);
    };


    return (
        <div>
            <button onClick={handleSwitchToPreviousRecipient}>Previous Recipient</button>
            <button onClick={handleSwitchToNextRecipient}>Next Recipient</button>
            <InputSliderZoomedView sliderId={recipientId} startingValue={startingValue} />
            <RecipientInfo recipientId={recipientId} />
        </div>
    );
}

export default RecipientSlide;
