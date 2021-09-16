import React from 'react';

function RoomInfo(props) {
    const style = {
        textAlign: 'center',
    };

    const { roomInfo } = props;

    let roomName, roomCode;
    try {
        roomCode = roomInfo.room_code;
        roomName = roomInfo.room_name;
    } catch {
        roomCode = '';
        roomName = '';
    }

    return (
        <div>
            <h1 style={style}>
                {roomName} [{roomCode}]
            </h1>
        </div>
    );
}
export default RoomInfo;
