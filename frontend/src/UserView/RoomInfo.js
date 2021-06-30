import React from 'react';

function RoomInfo(props) {
    return (
        <div>
            <h2>Room: {props.roomInfo.room_name}</h2>
            <h4>Amount: ${(props.roomInfo.splitting_cents / 100).toFixed(2)}</h4>
        </div>
    );
}
export default RoomInfo;
