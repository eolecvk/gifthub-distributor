import axios from 'axios';

function getNeedsScaleDownRatio(roomInfo, defaultDistribution) {
    let scaleDownRatio = 1;

    if (['survive', 'thrive'].includes(defaultDistribution)) {
        const roomAmount = roomInfo.splitting_cents / 100;
        const totalNeeds = roomInfo.recipients
            .map((recipientData) => {
                return defaultDistribution === 'survive'
                    ? recipientData.needs_lower_bound_cents / 100
                    : recipientData.needs_upper_bound_cents / 100;
            })
            .reduce((a, b) => a + b);

        if (totalNeeds > roomAmount) {
            scaleDownRatio = roomAmount / totalNeeds;
        }
    }

    return scaleDownRatio;
}

function getSlidersInitializationData(roomInfo, defaultDistribution) {
    if (roomInfo.recipients.length === 0) {
        return [];
    }

    if (defaultDistribution === 'zero' || defaultDistribution === 'shadow') {
        return roomInfo.recipients.map((recipientData) => ({
            recipientId: recipientData.recipient_id,
            title: recipientData.name,
            surviveValue: recipientData.needs_lower_bound_cents / 100,
            thriveValue: recipientData.needs_upper_bound_cents / 100,
            startingValue: 0,
            maxValue: roomInfo.splitting_cents / 100,
        }));
    }

    if (defaultDistribution === 'equal') {
        const equalSplit = roomInfo.splitting_cents / 100 / roomInfo.recipients.length;
        const equalSplitFloor = Math.floor(equalSplit);
        let remainder =
            roomInfo.splitting_cents / 100 - equalSplitFloor * roomInfo.recipients.length;
        let startingValues = Array(roomInfo.recipients.length).fill(equalSplitFloor);

        for (let i = remainder; i > 0; i--) {
            startingValues[i] += 1;
        }

        return roomInfo.recipients.map((recipientData, index) => ({
            recipientId: recipientData.recipient_id,
            title: recipientData.name,
            surviveValue: recipientData.needs_lower_bound_cents / 100,
            thriveValue: recipientData.needs_upper_bound_cents / 100,
            startingValue: startingValues[index],
            maxValue: roomInfo.splitting_cents / 100,
        }));
    }

    //for needs based distributions compute optional scaleDownRatio
    //applicable when the max amounts set can only be a fraction of the actual needs amount
    const scaleDownRatio = getNeedsScaleDownRatio(roomInfo, defaultDistribution);

    if (defaultDistribution === 'survive') {
        return roomInfo.recipients.map((recipientData) => ({
            recipientId: recipientData.recipient_id,
            title: recipientData.name,
            surviveValue: recipientData.needs_lower_bound_cents / 100,
            thriveValue: recipientData.needs_upper_bound_cents / 100,
            startingValue: Math.floor(
                (recipientData.needs_lower_bound_cents / 100) * scaleDownRatio
            ),
            maxValue: roomInfo.splitting_cents / 100,
        }));
    }

    if (defaultDistribution === 'thrive') {
        return roomInfo.recipients.map((recipientData) => ({
            recipientId: recipientData.recipient_id,
            title: recipientData.name,
            surviveValue: recipientData.needs_lower_bound_cents / 100,
            thriveValue: recipientData.needs_upper_bound_cents / 100,
            startingValue: Math.floor(
                (recipientData.needs_upper_bound_cents / 100) * scaleDownRatio
            ),
            maxValue: roomInfo.splitting_cents / 100,
        }));
    }
}

function getStartingValues(slidersInitializationData) {
    let startingValues = {};
    for (const sliderData of slidersInitializationData) {
        startingValues[sliderData['recipientId']] = sliderData['startingValue'];
    }
    return startingValues;
}

// Generate updated version of state `currentState`
// when inserting a new move of `newValue` at sliderId `id`
function getStateObjectNewMoves(currentState, newSliderValues) {
    return {
        currentValues: { ...newSliderValues }, // NEED TO DEPRECATED THIS
        reset: false,
        history: {
            index: currentState.history.index + 1,
            states: [
                ...currentState.history.states.slice(0, currentState.history.index + 1),
                { ...newSliderValues },
            ],
        },
    };
}

function registerEvents(events, roomCode) {
    const payload = { events: events };

    axios
        .put(`/api/${roomCode}`, payload)
        .then((response) => {
            console.log(`[${response.status}] PUT /api/${roomCode}`);
        })
        .catch((error) => {
            console.log('Register event error');
            console.log(error);
            console.log(payload);
        });
}

function registerVote(newSliderValues, roomCode) {
    // EDIT SLIDERGRIDSTATE IN SESSIONSTORAGE
    const currentGridState = JSON.parse(sessionStorage.getItem('sliderGridState'));
    const newGridState = getStateObjectNewMoves(currentGridState, newSliderValues);
    sessionStorage.setItem('sliderGridState', JSON.stringify(newGridState));

    // SEND REQUEST TO
    const events = Object.keys(newSliderValues).map((key) => {
        return {
            kind: 'ADJUST',
            recipient_id: key,
            new_value_cents: newSliderValues[key] * 100,
        };
    });

    registerEvents(events, roomCode);
}

function registerRecipientUpdate(args) {
    //WHERE DO WE FIND THE recipient_id ?? :D
    const {
        roomCode,
        recipientId,
        username,
        needsDescription,
        needsLowerBoundCents,
        needsUpperBoundCents,
    } = args;
    const event = {
        kind: 'RECIPIENT_UPDATE',
        recipient_id: recipientId,
    };

    if (typeof username !== 'undefined') {
        event['name'] = username;
    }
    if (typeof needsDescription !== 'undefined') {
        event['needs_description'] = needsDescription;
    }
    if (typeof needsLowerBoundCents !== 'undefined') {
        event['needs_lower_bound_cents'] = needsLowerBoundCents;
    }
    if (typeof needsUpperBoundCents !== 'undefined') {
        event['needs_upper_bound_cents'] = needsUpperBoundCents;
    }

    const events = [event];
    registerEvents(events, roomCode);
}

function parseSliderStartingValue(recipientId) {
    let parsedStartingValue;
    try {
        const sliderGridState = JSON.parse(sessionStorage.getItem('sliderGridState'));
        const sliderValues = sliderGridState.currentValues;
        parsedStartingValue = sliderValues[`${recipientId}`];
    } catch {
        parsedStartingValue = 0;
    }
    return parsedStartingValue;
}

export {
    getNeedsScaleDownRatio,
    getSlidersInitializationData,
    getStartingValues,
    getStateObjectNewMoves,
    registerVote,
    registerRecipientUpdate,
    parseSliderStartingValue,
};
