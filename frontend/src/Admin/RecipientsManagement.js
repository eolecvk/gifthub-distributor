import React from 'react';
import CustomButton from '../CustomButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

function RecipientsManagement() {
    const handleUploadRecipients = () => {
        console.log('Upload Recipients');
    };

    return (
        <div>
            <h3>Recipients</h3>
            <div style={{ margin: 15 + 'px' }}>
                <CustomButton
                    title="Upload recipients data"
                    startIcon={<CloudUploadIcon />}
                    size="medium"
                    onClick={handleUploadRecipients}
                />
            </div>
        </div>
    );
}

export default RecipientsManagement;
