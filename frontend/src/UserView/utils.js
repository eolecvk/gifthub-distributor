import React from 'react';
import InputSlider from './InputSlider';
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

function makeSliderGrid(slidersInitializationData, currentValues, handleUpdate, reset) {
    return slidersInitializationData
        .sort((sl1, sl2) => sl1.personId - sl2.personId)
        .map((slData) => (
            <InputSlider
                sliderId={slData.personId.toString()}
                title={slData.title}
                surviveValue={slData.surviveValue}
                thriveValue={slData.thriveValue}
                startingValue={
                    reset ? slData.startingValue : currentValues[slData.personId.toString()]
                }
                maxValue={slData.maxValue}
                handleUpdate={handleUpdate}
            />
        ));
}

function getStartingValues(slidersInitializationData) {
    let startingValues = {};
    for (const sliderData of slidersInitializationData) {
        startingValues[sliderData['personId']] = sliderData['startingValue'];
    }

    return startingValues;
}

function registerVote(sliderValues, roomInfo) {
    if (roomInfo.people.length === 0) {
        return;
    }

    const events = roomInfo.people.map((p) => {
        return {
            kind: 'ADJUST',
            bar_id: Number(p.person_id),
            new_value_cents:
                p.person_id in sliderValues ? Number(sliderValues[p.person_id] * 100) : 0,
        };
    });

    const payload = { events: events };

    axios
        .put(`/api/${roomInfo.room_code}`, payload)
        .then((response) => {
            console.log(JSON.stringify(response));
        })
        .catch((error) => {
            console.log(error);
            console.log(payload);
        });
}

export { getSlidersInitializationData, makeSliderGrid, getStartingValues, registerVote };
