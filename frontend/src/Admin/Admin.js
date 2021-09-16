import React, { useEffect } from 'react';
import RoomManagement from './RoomManagement';
import RecipientsManagement from './RecipientsManagement';
import VotersManagement from './VotersManagement';
import { refreshCachedRoomInfo } from '../utils';

function Admin(props) {
    const { roomCode } = props.match.params;

    useEffect(() => {
        refreshCachedRoomInfo(roomCode);
    });

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Admin</h1>
            <div>
                <RoomManagement roomCode={roomCode} />
                <RecipientsManagement roomCode={roomCode} />
                <VotersManagement roomCode={roomCode} />
            </div>
        </div>
    );
}

export default Admin;
