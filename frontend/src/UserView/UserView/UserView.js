import React from 'react'
import { useCookies } from "react-cookie";
import ButtonAndSliders from '../ButtonAndSliders/ButtonAndSliders';

function InputPage() {

    const [cookies, setCookie] = useCookies(["roomInfo"]);
    // const roomInfo = cookies.roomInfo

    const roomInfo = {
        room_name: "TechCoop Money Pile #1",
        room_code: "CCCS",
        splitting_cents: 30000,
        people: [
            {
                people_id: 1,
                name: "Eole",
                needs_description: "?",
                needs_lower_bound_cents: 2000,
                needs_upper_bound_cents: 9000  
            },
            {
                people_id: 2,
                name: "David",
                needs_description: "?",
                needs_lower_bound_cents: 2000,
                needs_upper_bound_cents: 9000  
            },
            {
                people_id: 3,
                name: "Oliver",
                needs_description: "?",
                needs_lower_bound_cents: 2000,
                needs_upper_bound_cents: 9000  
            },
            {
                people_id: 4,
                name: "Tyler",
                needs_description: "?",
                needs_lower_bound_cents: 2000,
                needs_upper_bound_cents: 9000  
            },
            {
                people_id: 5,
                name: "Brent",
                needs_description: "?",
                needs_lower_bound_cents: 2000,
                needs_upper_bound_cents: 9000  
            },
            {
                people_id: 6,
                name: "Roni",
                needs_description: "?",
                needs_lower_bound_cents: 2000,
                needs_upper_bound_cents: 9000  
            },
        ]
    }

    return (
        <div>
            <h1>Input Page</h1>
            <h2>{roomInfo.room_name}</h2>
            <h2>Amount: ${(roomInfo.splitting_cents / 100).toFixed(2)}</h2>
            <ButtonAndSliders
                roomInfo={roomInfo}
            />
        </div>
    )
}
export default InputPage;