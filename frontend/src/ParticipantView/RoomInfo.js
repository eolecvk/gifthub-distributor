import React from 'react';

function RoomInfo(props) {
    const style = {
        textAlign: 'center',
    };

    return (
        <div>
            <h1 style={style}>{props.roomInfo.room_name}</h1>
        </div>
    );
}
export default RoomInfo;
