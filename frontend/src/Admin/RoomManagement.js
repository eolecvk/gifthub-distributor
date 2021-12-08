import React, { useState } from 'react';
import { ButtonGroup } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import EditIcon from '@material-ui/icons/Edit';
import { refreshCachedRoomInfo } from '../utils';
import CustomButton from '../CustomButton';
import CustomModal from '../CustomModal';
import Papa from 'papaparse';
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
        refreshCachedRoomInfo(roomCode);
        const roomInfo = JSON.parse(sessionStorage.getItem('roomInfo'));

        const voterNamesById = Object.fromEntries(
            roomInfo.voters.map(function (voter) {
                return [voter.voter_id, voter.name];
            })
        );
        const csvData = roomInfo.recipients.map(function (recipient) {
            const output = {
                name: recipient.name,
                received_amount: recipient.avg_cents,
                survive: recipient.needs_lower_bound_cents,
                thrive: recipient.needs_upper_bound_cents,
                description: recipient.needs_description,
            };
            Object.entries(recipient.votes_cents).forEach(function (vote) {
                output[voterNamesById[parseInt(vote[0])]] = vote[1];
            });
            return output;
        });

        downloadFile({
            data: Papa.unparse(csvData),
            fileName: `${roomCode}.csv`,
            fileType: 'text/csv',
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
