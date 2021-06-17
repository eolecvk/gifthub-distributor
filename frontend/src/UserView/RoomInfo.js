import React from 'react'

function RoomInfo(props) {
    return (
        <div>
            <h4>Room info:</h4>
            <p>Name: {props.roomInfo.room_name}</p>
            <p>Code: {props.roomInfo.room_code}</p>
            <p>Amount: ${(props.roomInfo.splitting_cents / 100).toFixed(2)}</p>
        </div>
    )
}
export default RoomInfo