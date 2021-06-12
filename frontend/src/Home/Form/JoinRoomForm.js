import React, { useState } from 'react'
import { useCookies } from "react-cookie";
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import './Form.css'

function JoinRoomForm(props) {

    const history = useHistory()
    const close = () => props.onSubmit()
    const [roomCode, setRoomCode] = useState('')
    const [name, setName] = useState('')
    const [needsLowerBoundCents, setNeedsLowerBoundCents] = useState(0)
    const [needsUpperBoundCents, setNeedsUpperBoundCents] = useState(0)
    const [needsDescription, setNeedsDescription] = useState('')
    const [cookies, setCookie] = useCookies(["roomInfo"]);

    function saveRoomInfo(roomInfo) {
        setCookie("roomInfo", roomInfo, { path: "/" });
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        //form payload
        const payload = {
            name: name,
            needs_description: needsDescription,
            needs_lower_bound_cents: needsLowerBoundCents * 100,
            needs_upper_bound_cents: needsUpperBoundCents * 100
        }

        //console.log(payload)

        // send request with axios
        axios
            .post(`/api/${roomCode}/join`, payload)
            .then(response => {
                if (response.status === 200) {
                    saveRoomInfo(response.data)
                    history.push('/input-page')
                }
            })
            .catch(error => {
                console.log(error.response)
                if (error.response.data.error === 'That room does not exist' ) {
                    alert('That room does not exist')
                }
            });
        close()

        //FOR DEV ONLY
        // const response = {
        //     room_name: "TechCoop Money Pile #1",
        //     room_code: "CCCS",
        //     splitting_cents: 30000,
        //     people: [
        //         {
        //             people_id : 1,
        //             name: "Eole",
        //             needs_description: "?",
        //             needs_upper_bound_cents: 2000,
        //             needs_lower_bound_cents: 4000,
        //         },
        //         {
        //             people_id : 2,
        //             name: "David",
        //             needs_description: "?",
        //             needs_upper_bound_cents: 2000,
        //             needs_lower_bound_cents: 4000,
        //         },
        //         {
        //             people_id : 3,
        //             name: "Oliver",
        //             needs_description: "?",
        //             needs_upper_bound_cents: 2000,
        //             needs_lower_bound_cents: 4000,
        //         },
        //         {
        //             people_id : 4,
        //             name: "Tyler",
        //             needs_description: "?",
        //             needs_upper_bound_cents: 2000,
        //             needs_lower_bound_cents: 4000,
        //         },
        //         {
        //             people_id : 5,
        //             name: "Brent",
        //             needs_description: "?",
        //             needs_upper_bound_cents: 2000,
        //             needs_lower_bound_cents: 4000,
        //         },
        //         {
        //             people_id : 6,
        //             name: "Roni",
        //             needs_description: "?",
        //             needs_upper_bound_cents: 2000,
        //             needs_lower_bound_cents: 4000,
        //         },
        //     ]
        // };
        // saveRoomInfo(response)               
        // history.push('/input-page');
        // close()
    }

    return (
        <form onSubmit={(e) => { handleSubmit(e) }}>
            <label> Room code:
                <input
                    type="text"
                    required
                    value={roomCode}
                    onChange={(e) => { setRoomCode(e.target.value) }} />
            </label>
            <label> Username:
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => { setName(e.target.value) }} />
            </label>
            <label> Need min ($):
                <input type="number"
                    required
                    min="0"
                    value={needsLowerBoundCents}
                    onChange={(e) => { setNeedsLowerBoundCents(e.target.value) }} />
            </label>
            <label> Need max ($):
                <input type="number"
                    required
                    min={needsLowerBoundCents}
                    value={needsUpperBoundCents}
                    onChange={(e) => { setNeedsUpperBoundCents(e.target.value) }} />
            </label>
            <label> Need description:
                <input type="text"
                    value={needsDescription}
                    onChange={(e) => { setNeedsDescription(e.target.value) }} />
            </label>
            <button
                type="submit"
                name="Submit">Submit
            </button>
        </form >
    )
}

export default JoinRoomForm