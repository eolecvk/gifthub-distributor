import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import getColor from './colors';
import { formatAsUSD } from '../utils';

function RecipientFace(props) {
    const { sliderId, title, openSingleRecipientView, openRecipientModal, currentAvg } = props;

    function handleOpenSingleRecipientView() {
        if (openSingleRecipientView) {
            // Only allow voters to open single recipient view
            openSingleRecipientView(sliderId);
        } else {
            // For observers, open modal to allow editing
            openRecipientModal(sliderId);
        }
    }

    return (
        <Grid container direction="column" alignItems="center" justifyContent="center">
            <Grid item>
                <FaceIcon
                    onClick={handleOpenSingleRecipientView}
                    fontSize="large"
                    style={{ color: getColor(sliderId) }}
                />
            </Grid>
            <Grid
                container
                item
                onClick={handleOpenSingleRecipientView}
                wrap="nowrap"
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <Grid>
                    <Typography id={'title' + sliderId.toString()}>{title}</Typography>
                </Grid>
                <Grid>
                    <Typography id={'amount' + sliderId.toString()}>
                        {formatAsUSD(currentAvg)}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default RecipientFace;
