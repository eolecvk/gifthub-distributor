import React, { useState } from 'react';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import VotersManagementForm from './VotersManagementForm';
import CustomButton from '../CustomButton';
import CustomModal from '../CustomModal';

function VotersManagement(props) {
    const [openVotersManagementModal, setOpenVotersManagementModal] = useState(false);
    const { roomCode } = props;

    const handleOpenVotersManagementModal = () => {
        setOpenVotersManagementModal(true);
    };

    const handleCloseVotersManagementModal = () => {
        setOpenVotersManagementModal(false);
    };

    return (
        <div>
            <h3>Voters</h3>
            <div style={{ margin: 15 + 'px' }}>
                <CustomButton
                    title="MANAGE VOTERS"
                    startIcon={<HighlightOffIcon />}
                    size="small"
                    onClick={handleOpenVotersManagementModal}
                />
            </div>

            <CustomModal
                title="Manage Voters"
                form={<VotersManagementForm roomCode={roomCode} />}
                show={openVotersManagementModal}
                handleClose={handleCloseVotersManagementModal}
                style={{ width: 300 + 'px' }}
            />
        </div>
    );
}

export default VotersManagement;
