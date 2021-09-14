import React, { useState } from 'react';
import { ButtonGroup } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import EditIcon from '@material-ui/icons/Edit';
import { refreshCachedRoomInfo } from '../utils';
import CustomButton from '../CustomButton';
import CustomModal from '../CustomModal';
import EditRoomForm from './EditRoomForm';

function RoomManagement(props) {
    const [openEditRoomModal, setOpenEditRoomModal] = useState(false);
    const { roomCode } = props;

    const handleOpenEditRoomModal = () => {
        setOpenEditRoomModal(true);
    };

    const handleCloseEditRoomModal = () => {
        setOpenEditRoomModal(false);
    };

    const downloadFile = ({ data, fileName, fileType }) => {
        // Create a blob with the data we want to download as a file
        const blob = new Blob([data], { type: fileType });
        // Create an anchor element and dispatch a click event on it
        // to trigger a download
        const a = document.createElement('a');
        a.download = fileName;
        a.href = window.URL.createObjectURL(blob);
        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        a.dispatchEvent(clickEvt);
        a.remove();
    };

    const exportRoomInfoToJson = (e) => {
        e.preventDefault();

        //const roomInfo = fetchRoomInfo(roomCode)
        refreshCachedRoomInfo(roomCode);
        const roomInfo = JSON.parse(sessionStorage.getItem('roomInfo'));

        downloadFile({
            data: JSON.stringify(roomInfo),
            fileName: `${roomCode}.json`,
            fileType: 'text/json',
        });
    };

    return (
        <div>
            <h3>Room</h3>

            <div style={{ margin: 15 + 'px' }}>
                <ButtonGroup orientation="vertical">
                    <CustomButton
                        title="Edit room config"
                        startIcon={<EditIcon />}
                        size="medium"
                        onClick={handleOpenEditRoomModal}
                    />

                    <CustomButton
                        title="Download session data"
                        startIcon={<CloudDownloadIcon />}
                        size="medium"
                        onClick={exportRoomInfoToJson}
                    />
                </ButtonGroup>

                <CustomModal
                    title="Edit Room Info"
                    form={
                        <EditRoomForm handleClose={handleCloseEditRoomModal} roomCode={roomCode} />
                    }
                    show={openEditRoomModal}
                    handleClose={handleCloseEditRoomModal}
                />
            </div>
        </div>
    );
}

export default RoomManagement;
