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
                    title="MANAGE DISTRIBUTORS"
                    startIcon={<HighlightOffIcon />}
                    size="medium"
                    onClick={handleOpenVotersManagementModal}
                />
            </div>

            <CustomModal
                title="Manage Distributors"
                form={<VotersManagementForm roomCode={roomCode} />}
                show={openVotersManagementModal}
                handleClose={handleCloseVotersManagementModal}
            />
        </div>
    );
}

export default VotersManagement;
