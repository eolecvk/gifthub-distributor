import React from 'react';
import CustomButton from '../CustomButton';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

function VotersManagement() {
    const handleKickVoters = () => {
        console.log('handleKickVoters');
    };

    return (
        <div>
            <h3>Voters</h3>
            <div style={{ margin: 15 + 'px' }}>
                <CustomButton
                    title="Kick sum voters"
                    startIcon={<HighlightOffIcon />}
                    size="medium"
                    onClick={handleKickVoters}
                />
            </div>
        </div>
    );
}

export default VotersManagement;
