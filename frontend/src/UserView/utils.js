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
                key={slData.personId.toString()}
                sliderId={slData.personId.toString()}
                title={slData.title.toUpperCase()}
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

export { getSlidersInitializationData, makeSliderGrid, getStartingValues, registerVote };
