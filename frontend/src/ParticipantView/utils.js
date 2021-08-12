import axios from 'axios';

function getNeedsScaleDownRatio(roomInfo, defaultDistribution) {
    let scaleDownRatio = 1;

    if (['survive', 'thrive'].includes(defaultDistribution)) {
        const roomAmount = roomInfo.splitting_cents / 100;
        const totalNeeds = roomInfo.people
            .map((userData) => {
                return (
                    defaultDistribution === 'survive'
                        ? userData.needs_lower_bound_cents / 100
                        : userData.needs_upper_bound_cents / 100)
            })
            .reduce((a, b) => a + b);

        if (totalNeeds > roomAmount) {
            scaleDownRatio = roomAmount / totalNeeds;
        }
    }

    return scaleDownRatio;
}

function getSlidersInitializationData(roomInfo, defaultDistribution) {
    if (defaultDistribution === 'zero') {
        return roomInfo.people.map((userData) => ({
            personId: userData.person_id,
            title: userData.name,
            surviveValue: userData.needs_lower_bound_cents / 100,
            thriveValue: userData.needs_upper_bound_cents / 100,
            startingValue: 0,
            maxValue: roomInfo.splitting_cents / 100,
        }));
    }

    if (defaultDistribution === 'equal') {
        const equalSplit = roomInfo.splitting_cents / 100 / roomInfo.people.length;
        const equalSplitFloor = Math.floor(equalSplit);
        let remainder = roomInfo.splitting_cents / 100 - equalSplitFloor * roomInfo.people.length;
        let startingValues = Array(roomInfo.people.length).fill(equalSplitFloor);

        for (let i = remainder; i > 0; i--) {
            startingValues[i] += 1;
        }

        return roomInfo.people.map((userData, index) => ({
            personId: userData.person_id,
            title: userData.name,
            surviveValue: userData.needs_lower_bound_cents / 100,
            thriveValue: userData.needs_upper_bound_cents / 100,
            startingValue: startingValues[index],
            maxValue: roomInfo.splitting_cents / 100,
        }));
    }

    //for needs based distributions compute optional scaleDownRatio
    //applicable when the max amounts set can only be a fraction of the actual needs amount
    const scaleDownRatio = getNeedsScaleDownRatio(roomInfo, defaultDistribution);

    if (defaultDistribution === 'survive') {
        return roomInfo.people.map((userData) => ({
            personId: userData.person_id,
            title: userData.name,
            surviveValue: userData.needs_lower_bound_cents / 100,
            thriveValue: userData.needs_upper_bound_cents / 100,
            startingValue: Math.floor((userData.needs_lower_bound_cents / 100) * scaleDownRatio),
            maxValue: roomInfo.splitting_cents / 100,
        }));
    }

    if (defaultDistribution === 'thrive') {
        return roomInfo.people.map((userData) => ({
            personId: userData.person_id,
            title: userData.name,
            surviveValue: userData.needs_lower_bound_cents / 100,
            thriveValue: userData.needs_upper_bound_cents / 100,
            startingValue: Math.floor((userData.needs_upper_bound_cents / 100) * scaleDownRatio),
            maxValue: roomInfo.splitting_cents / 100,
        }));
    }
}

function getStartingValues(slidersInitializationData) {
    let startingValues = {};
    for (const sliderData of slidersInitializationData) {
        startingValues[sliderData['personId']] = sliderData['startingValue'];
    }
    return startingValues;
}

function registerEvents(events, roomCode) {
    const payload = { events: events };

    axios
        .put(`/api/${roomCode}`, payload)
        .then((response) => {
            console.log(`[${response.status}] PUT /api/${roomCode}`);
        })
        .catch((error) => {
            console.log(error);
            console.log(payload);
        });
}

function registerVote(sliderValues, roomCode) {
    const events = Object.keys(sliderValues).map((key) => {
        return {
            kind: 'ADJUST',
            bar_id: key,
            new_value_cents: sliderValues[key] * 100,
        };
    });

    registerEvents(events, roomCode);
}

function registerNeedsUpdate(args, roomCode) {
    const { needsDescription, needsLowerBoundCents, needsUpperBoundCents } = args;
    const event = { kind: 'NEEDS_UPDATE' };

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

export {
    getNeedsScaleDownRatio,
    getSlidersInitializationData,
    getStartingValues,
    registerVote,
    registerNeedsUpdate,
};
