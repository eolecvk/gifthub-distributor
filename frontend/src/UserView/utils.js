import axios from 'axios';

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
        return roomInfo.people.map((userData) => ({
            personId: userData.person_id,
            title: userData.name,
            surviveValue: userData.needs_lower_bound_cents / 100,
            thriveValue: userData.needs_upper_bound_cents / 100,
            startingValue: roomInfo.splitting_cents / 100 / roomInfo.people.length,
            maxValue: roomInfo.splitting_cents / 100,
        }));
    }

    if (defaultDistribution === 'survive') {
        return roomInfo.people.map((userData) => ({
            personId: userData.person_id,
            title: userData.name,
            surviveValue: userData.needs_lower_bound_cents / 100,
            thriveValue: userData.needs_upper_bound_cents / 100,
            startingValue: userData.needs_lower_bound_cents / 100,
            maxValue: roomInfo.splitting_cents / 100,
        }));
    }

    if (defaultDistribution === 'thrive') {
        return roomInfo.people.map((userData) => ({
            personId: userData.person_id,
            title: userData.name,
            surviveValue: userData.needs_lower_bound_cents / 100,
            thriveValue: userData.needs_upper_bound_cents / 100,
            startingValue: userData.needs_upper_bound_cents / 100,
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

function registerVote(sliderValues, roomCode) {
    const events = Object.keys(sliderValues).map((key) => {
        return {
            kind: 'ADJUST',
            bar_id: key,
            new_value_cents: sliderValues[key] * 100,
        };
    });

    const payload = { events: events };

    axios
        .put(`/api/${roomCode}`, payload)
        .then((response) => {
            console.log(JSON.stringify(response));
        })
        .catch((error) => {
            console.log(error);
            console.log(payload);
        });
}

export { getSlidersInitializationData, getStartingValues, registerVote };
