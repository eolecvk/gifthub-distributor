import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ButtonGroup, Tooltip, Container } from '@material-ui/core';
//import Modal from '@material-ui/core/Modal';
import './ButtonUpdateDefaultDistribution.css';
import CustomButton from '../CustomButton';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import CustomModal from '../CustomModal';

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        top: 25 + '%',
        left: 12 + '%',
        transform: 'translateY(' + -50 + '%), translateX(' + -50 + '%)',
        margin: 'auto',
        justifyContent: 'center',
        verticalAlign: 'middle',
        width: 220,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(3, 4, 3),
    },
}));

function UpdateDefaultDistributionModal(props) {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickDistributionButton = (distributionName) => {
        props.updateDefaultDistribution(distributionName);
        setOpen(false);
    };

    const classes = useStyles();
    const body = (
        // <div className={classes.paper}>
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
        <div className={classes.root}>
            <CustomButton
                title="Quick distributions"
                size="small"
                startIcon={<OfflineBoltIcon />}
                onClick={() => handleOpen()}
            />

            <Container>
                {/* <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body}
                </Modal> */}
                <CustomModal
                    form={body}
                    modalTitle="Quick distribution"
                    show={open}
                    handleClose={handleClose}
                />
            </Container>
        </div>
    );
}

export default UpdateDefaultDistributionModal;
