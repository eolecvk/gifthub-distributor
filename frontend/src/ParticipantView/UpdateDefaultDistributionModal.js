import React from 'react';
import { ButtonGroup, Container } from '@material-ui/core';
import CustomButton from '../CustomButton';
import CustomModal from '../CustomModal';
import './ButtonUpdateDefaultDistribution.css';

function UpdateDefaultDistributionModal(props) {
    const { show, hideQuickDistributionModal, updateDefaultDistribution } = props;

    const handleClose = () => {
        hideQuickDistributionModal();
    };

    const handleClickDistributionButton = (distributionName) => {
        updateDefaultDistribution(distributionName);
        hideQuickDistributionModal();
    };

    const body = (
        <ButtonGroup orientation="vertical">
            <CustomButton
                title="Set to 0"
                size="small"
                onClick={(e) => handleClickDistributionButton('zero')}
            />

            <CustomButton
                title="Set equally"
                size="small"
                onClick={(e) => handleClickDistributionButton('equal')}
            />

            <CustomButton
                title="Set to survive"
                size="small"
                onClick={(e) => handleClickDistributionButton('survive')}
            />

            <CustomButton
                title="Set to thrive"
                size="small"
                onClick={(e) => handleClickDistributionButton('thrive')}
            />
        </ButtonGroup>
    );

    return (
        <div>
            <Container>
                <CustomModal
                    form={body}
                    title="Quick distribution"
                    show={show}
                    handleClose={handleClose}
                />
            </Container>
        </div>
    );
}

export default UpdateDefaultDistributionModal;
