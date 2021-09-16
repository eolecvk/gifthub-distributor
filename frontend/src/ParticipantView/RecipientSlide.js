import React, { useEffect, useState } from 'react';
import { ButtonGroup } from '@material-ui/core';
import CustomButton from '../CustomButton';
import InputSliderZoomedView from './InputSliderZoomedView';
import RecipientInfo from './RecipientInfo';
import { parseSliderStartingValue } from './utils';

function RecipientSlide(props) {
    const { openAtRecipientId, progressBar } = props;
    const [recipientId, setRecipientId] = useState(openAtRecipientId);
    let startingValue = parseSliderStartingValue(recipientId);

    useEffect(() => {
        const newStartingValue = parseSliderStartingValue(recipientId);
        startingValue = newStartingValue;
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
            {progressBar}
            <ButtonGroup>
                <CustomButton
                    title="Previous recipient"
                    onClick={handleSwitchToPreviousRecipient}
                />
                <CustomButton title="Next recipient" onClick={handleSwitchToNextRecipient} />
            </ButtonGroup>
            <InputSliderZoomedView sliderId={recipientId} startingValue={startingValue} />
            <RecipientInfo
                recipientId={recipientId}
                closeRecipientModal={handleSwitchToNextRecipient}
            />
        </div>
    );
}

export default RecipientSlide;
