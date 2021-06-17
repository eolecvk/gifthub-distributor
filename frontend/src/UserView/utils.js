import React from 'react'
import InputSlider from './InputSlider'
import axios from 'axios'

function getSlidersInitializationData(roomInfo, defaultDistribution) {

    if (defaultDistribution === 'zero') {
        return (
            roomInfo.people.map(
                userData => (
                    {
                        "peopleId": userData.people_id,
                        "title": userData.name,
                        "surviveValue": userData.needs_lower_bound_cents / 100,
                        "thriveValue": userData.needs_upper_bound_cents / 100,
                        "startingValue": 0,
                        "maxValue": roomInfo.splitting_cents / 100
                    }
                )
            )
        )
    }

    if (defaultDistribution === 'equal') {
        return (
            roomInfo.people.map(
                userData => (
                    {
                        "peopleId": userData.people_id,
                        "title": userData.name,
                        "surviveValue": userData.needs_lower_bound_cents / 100,
                        "thriveValue": userData.needs_upper_bound_cents / 100,
                        "startingValue": (roomInfo.splitting_cents / 100) / roomInfo.people.length,
                        "maxValue": roomInfo.splitting_cents / 100
                    }
                )
            )
        )
    }

    if (defaultDistribution === 'survive') {
        return (
            roomInfo.people.map(
                userData => (
                    {
                        "peopleId": userData.people_id,
                        "title": userData.name,
                        "surviveValue": userData.needs_lower_bound_cents / 100,
                        "thriveValue": userData.needs_upper_bound_cents / 100,
                        "startingValue": userData.needs_lower_bound_cents / 100,
                        "maxValue": roomInfo.splitting_cents / 100
                    }
                )
            )
        )
    }

    if (defaultDistribution === 'thrive') {
        return (
            roomInfo.people.map(
                userData => (
                    {
                        "peopleId": userData.people_id,
                        "title": userData.name,
                        "surviveValue": userData.needs_lower_bound_cents / 100,
                        "thriveValue": userData.needs_upper_bound_cents / 100,
                        "startingValue": userData.needs_upper_bound_cents / 100,
                        "maxValue": roomInfo.splitting_cents / 100
                    }
                )
            )
        )
    }
}

function makeSliderGrid(slidersInitializationData, currentValues, handleUpdate, reset) {

    return (
        slidersInitializationData.map(slData =>
            <li key={slData.peopleId.toString()}>
                <InputSlider
                    sliderId={slData.peopleId.toString()}
                    title={slData.title}
                    surviveValue={slData.surviveValue}
                    thriveValue={slData.thriveValue}
                    startingValue={reset ? slData.startingValue : currentValues[slData.peopleId.toString()]}
                    maxValue={slData.maxValue}
                    handleUpdate={handleUpdate}
                />
            </li>
        )
    )
}



function getStartingValues(slidersInitializationData) {
    let startingValues = {}
    for (const sliderData of slidersInitializationData) {
        startingValues[sliderData["peopleId"]] = sliderData["startingValue"]
    }

    return startingValues
}

function registerVote(SliderValues, roomCode) {
    const keys = Object.keys(sliderValues)
    const events = keys.map(key => {
        return {
            kind: 'ADJUST',
            bar_id: Number(key),
            key: Number(sliderValues[key])
        }
    })
    const payload = { events: events }

    axios.put(`/api/${roomCode}`, payload)
        .then(response => { console.log(JSON.stringify(response)) })
        .catch(error => { console.log(error) })
}

export { getSlidersInitializationData, makeSliderGrid, getStartingValues, registerVote }