import React, { Component } from 'react'
import InputSlider from './Sliders'



function InputPage() {

    // Placeholder for return value of request:
    // POST /api/[roomcode]/join
    const response = {
        room_name: "TechCoop Money Pile #1",
        room_code: "CCCS",
        splitting_cents: 30000,
        people: [
            {
                name: "Eole",
                needs_description: "?",
                needs_upper_bound_cents: 2000,
                needs_lower_bound_cents: 4000,
            },
            {
                name: "David",
                needs_description: "?",
                needs_upper_bound_cents: 2000,
                needs_lower_bound_cents: 4000,
            },
            {
                name: "Oliver",
                needs_description: "?",
                needs_upper_bound_cents: 2000,
                needs_lower_bound_cents: 4000,
            },
            {
                name: "Tyler",
                needs_description: "?",
                needs_upper_bound_cents: 2000,
                needs_lower_bound_cents: 4000,
            },
            {
                name: "Brent",
                needs_description: "?",
                needs_upper_bound_cents: 2000,
                needs_lower_bound_cents: 4000,
            },
            {
                name: "Roni",
                needs_description: "?",
                needs_upper_bound_cents: 2000,
                needs_lower_bound_cents: 4000,
            },
        ]
    };

    const amountDollars = (response.splitting_cents / 100).toFixed(2);

    const inputList = response.people.map( userData => <InputSlider title={userData.name} />)

    return (
        <div>
            <h1>Input Page</h1>
            <h2>{response.room_name}</h2>
            <h2>Amount: ${amountDollars}</h2>
            {inputList}
        </div>
    )
}
export default InputPage;