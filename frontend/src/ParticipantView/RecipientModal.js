import React, { useEffect } from 'react';
import RecipientInfo from './RecipientInfo';
import CustomModal from '../CustomModal';

function RecipientModal(props) {
    const { recipientId, closeRecipientModal } = props;
    const [openAtSlider, setOpenAtSlider] = React.useState(recipientId);

    useEffect(() => {
        setOpenAtSlider(recipientId);
    }, [recipientId]);

    return (
        <CustomModal
            title="Recipient Info"
            form={
                <RecipientInfo
                    recipientId={openAtSlider}
                    closeRecipientModal={closeRecipientModal}
                />
            }
            show={openAtSlider !== '' ? true : false}
            handleClose={closeRecipientModal}
        />
    );
}

export default RecipientModal;
