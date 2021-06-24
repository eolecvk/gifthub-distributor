import React from 'react'
import InputSlider from './InputSlider'
import axios from 'axios'
import debounce from "lodash/debounce";

function getSlidersInitializationData(roomInfo, defaultDistribution) {

    if (defaultDistribution === 'zero') {
        return (
            roomInfo.people.map(
                userData => (
                    {
                        "personId": userData.person_id,
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
                        "personId": userData.person_id,
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
                        "personId": userData.person_id,
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
                        "personId": userData.person_id,
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
            <li key={slData.personId.toString()}>
                <InputSlider
                    sliderId={slData.personId.toString()}
                    title={slData.title}
                    surviveValue={slData.surviveValue}
                    thriveValue={slData.thriveValue}
                    startingValue={reset ? slData.startingValue : currentValues[slData.personId.toString()]}
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
        startingValues[sliderData["personId"]] = sliderData["startingValue"]
    }

    return startingValues
}

//DEPRECATED votes are now in absolute value in cents in API
// function convertValuesToPercentiles(sliderValues, totalAmount) {
//     let percentilesValues = {}
//     const keys = Object.keys(sliderValues)
//     Object.keys(sliderValues).map(function(key, index) {
//         percentilesValues[key] = sliderValues[key] / totalAmount;
//       });
      
//     return percentilesValues
// }

function registerVote(sliderValues, roomInfo) {

    // DO NOT SEND REQUEST IF SLIDERS VALUES ARE NULL
    if (Object.values(sliderValues).length === 0){
        return
    }

    //const sliderValuesPercentiles = convertValuesToPercentiles(sliderValues, roomInfo.splitting_cents/100)
    const roomCode = roomInfo.room_code
    const keys = Object.keys(sliderValues) //sliderValuesPercentiles
    const events = keys.map(key => {
        return {
            kind: 'ADJUST',
            bar_id: Number(key),
            new_value: Number(sliderValues[key] * 100) //sliderValuesPercentiles[key]
        }
    })
    const payload = { events: events }

    axios.put(`/api/${roomCode}`, payload)
        .then(response => { console.log(JSON.stringify(response)) })
        .catch(error => {
            console.log(error)
            console.log(payload)
        })

    console.log('events ' + JSON.stringify(events))
}

export { getSlidersInitializationData, makeSliderGrid, getStartingValues, registerVote }