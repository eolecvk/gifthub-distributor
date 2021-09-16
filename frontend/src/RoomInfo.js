import React from 'react';

function RoomInfo(props) {
    const style = {
        textAlign: 'center',
    };

    const { roomInfo } = props;

    let roomName;
    try {
        roomName = roomInfo.room_name;
    } catch {
        roomName = '';
    }

    return (
        <div>
            <h1 style={style}>{roomName}</h1>
        </div>
    );
}
export default RoomInfo;
