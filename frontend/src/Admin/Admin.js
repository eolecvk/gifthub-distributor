import React from 'react';
import RoomManagement from './RoomManagement';
import RecipientsManagement from './RecipientsManagement';
import VotersManagement from './VotersManagement';

function Admin() {
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Admin</h1>
            <div>
                <RoomManagement />
                <RecipientsManagement />
                <VotersManagement />
            </div>
        </div>
    );
}

export default Admin;
