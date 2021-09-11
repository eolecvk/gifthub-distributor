import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import colors from './colors';
import { formatAsUSD } from '../utils';

function RecipientFace(props) {
    const { sliderId, title, openRecipientModal, currentAvg } = props;

    function handleClickFace() {
        openRecipientModal(sliderId);
    }

    const textUnderFace = `${title}\n${formatAsUSD(currentAvg)}`;

    return (
        <Grid container direction="column" alignItems="center" justifyContent="center">
            <Grid item>
                <FaceIcon
                    onClick={handleClickFace}
                    fontSize="large"
                    style={{ color: colors[sliderId] }}
                />
            </Grid>
            <Grid item>
                <Typography id={sliderId.toString() + 'input-slider'}>{textUnderFace}</Typography>
            </Grid>
        </Grid>
    );
}

export default RecipientFace;
