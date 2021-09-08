import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip, Container } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import './ButtonUpdateDefaultDistribution.css';

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
        <div className={classes.paper}>
            <h3 id="simple-modal-title">Select a quick distribution</h3>
            <div>
                <div>
                    <button
                        id="reset-button"
                        onClick={(e) => handleClickDistributionButton('zero')}
                    >
                        <span>Set to 0</span>
                    </button>
                </div>

                <div>
                    <button
                        id="equal-button"
                        onClick={(e) => handleClickDistributionButton('equal')}
                    >
                        <span>Set equally</span>
                    </button>
                </div>

                <div>
                    <button
                        id="survive-button"
                        onClick={(e) => handleClickDistributionButton('survive')}
                    >
                        <span>Set to survive</span>
                    </button>
                </div>

                <div>
                    <button
                        id="thrive-button"
                        onClick={(e) => handleClickDistributionButton('thrive')}
                    >
                        <span>Set to thrive</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className={classes.root}>
            <Tooltip title="Quick distributions">
                <button id="distributions-button" onClick={() => handleOpen()}>
                    <svg
                        version="1.1"
                        id="quick-distributions-icon"
                        x="0px"
                        y="0px"
                        viewBox="0 0 26.676 26.676"
                    >
                        <path
                            d="M12 2.02c-5.51 0-9.98 4.47-9.98 9.98s4.47 9.98 9.98
                        9.98 9.98-4.47 9.98-9.98S17.51 2.02 12 2.02zM11.48
                        20v-6.26H8L13 4v6.26h3.35L11.48 20z"
                        ></path>
                    </svg>
                </button>
            </Tooltip>
            <Container>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body}
                </Modal>
            </Container>
        </div>
    );
}

export default UpdateDefaultDistributionModal;
