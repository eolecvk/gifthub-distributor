import React from 'react';
import CustomButton from '../CustomButton';
import EditIcon from '@material-ui/icons/Edit';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { formatAsUSD } from '../utils';

function RoomManagement() {
    const handleOpenModalEditRoom = () => {
        console.log('Open Modal Edit Room Settings');
    };
    const handleDownloadRoomData = () => {
        console.log('Download Room Data');
    };

    const roomName = 'Some room name';
    const roomAmount = 1000;

    return (
        <div>
            <h3>Room</h3>

            <div style={{ margin: 15 + 'px' }}>
                <p>Name: {roomName}</p>
                <p>Amount : {formatAsUSD(roomAmount)}</p>
                <CustomButton
                    title="Edit room"
                    startIcon={<EditIcon />}
                    size="medium"
                    onClick={handleOpenModalEditRoom}
                />

                <div style={{ marginTop: 20 + 'px' }}>
                    <CustomButton
                        title="Download session data"
                        startIcon={<CloudDownloadIcon />}
                        size="medium"
                        onClick={handleDownloadRoomData}
                    />
                </div>
            </div>
        </div>
    );
}

export default RoomManagement;
