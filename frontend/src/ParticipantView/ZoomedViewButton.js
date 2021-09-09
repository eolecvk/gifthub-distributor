import React from 'react';
//import { Button, Tooltip, SvgIcon, Icon } from '@material-ui/core';
import PageviewIcon from '@material-ui/icons/Pageview';
import './ZoomedViewButton.css';
import CustomButton from '../CustomButton';
//import CustomButton from '../CustomButton';

function ZoomedViewButton(props) {
    return (
        <CustomButton
            title="Single Recipient View"
            size="small"
            startIcon={<PageviewIcon />}
            onClick={props.switchToZoomedView}
        />
    );
}

export default ZoomedViewButton;
