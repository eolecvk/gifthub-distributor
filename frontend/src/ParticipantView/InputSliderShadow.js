import React from 'react';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { Slider, Grid } from '@material-ui/core';
import RecipientFace from './RecipientFace';

const theme = createTheme({
    overrides: {
        MuiTooltip: {
            tooltip: {
                fontSize: '1em',
                color: 'yellow',
                backgroundColor: 'grey',
                border: '1px solid #dadde9',
                left: -20,
                top: 3,
                maxWidth: 200,
            },
        },
        MuiSlider: {
            thumb: {
                height: 0,
                width: 0,
                color: 'transparent',
            },
            track: {
                height: 3,
                borderRadius: 2,
                color: 'transparent',
            },
            rail: {
                height: 6,
                color: 'black',
            },
            mark: {
                color: 'grey',
                height: 15,
                width: 4,
                marginTop: 0,
            },
            markActive: {
                opacity: 1,
                backgroundColor: 'black',
            },
            markLabel: {
                fontSize: 18,
                color: 'grey',
                fontWeight: 'bold',
                transform: 'translate(-40%, 0%)',
            },
            markLabelActive: {
                fontSize: 18,
                color: 'black',
                fontWeight: 'bold',
                transform: 'translate(-40%, 0%)',
            },
        },
    },
});

function InputSliderShadow(props) {
    const {
        sliderId,
        title,
        surviveValue,
        thriveValue,
        startingValue,
        maxValue,
        openRecipientModal,
        recipientInfo,
    } = props;
    const groupVoteAvg = recipientInfo.avg_cents / 100;

    function getMarks(surviveValue, thriveValue) {
        const marks = [];

        const markSurvive = {
            value: surviveValue,
            label: ':)',
        };
        const markThrive = {
            value: thriveValue,
            label: ':D',
        };

        if (surviveValue <= maxValue) {
            marks.push(markSurvive);
        }
        if (thriveValue <= maxValue) {
            marks.push(markThrive);
        }

        return marks;
    }

    return (
        <MuiThemeProvider theme={theme}>
            <Grid key={props.sliderId.toString() + 'grid'} container direction={'row'} spacing={8}>
                <Grid container item xs={1}>
                    <RecipientFace
                        sliderId={sliderId}
                        title={title}
                        openRecipientModal={openRecipientModal}
                        currentAvg={groupVoteAvg}
                    />
                </Grid>
                <Grid item xs={9}>
                    <Slider
                        key={props.sliderId.toString() + 'slider'}
                        min={0}
                        max={maxValue}
                        value={startingValue ? startingValue : 0}
                        onChange={() => {
                            return null;
                        }}
                        onChangeCommitted={() => {
                            return null;
                        }}
                        aria-labelledby={props.sliderId.toString() + 'slider'}
                        marks={getMarks(surviveValue, thriveValue)}
                        valueLabelDisplay="off"
                        disabled={true}
                    />
                </Grid>
            </Grid>
        </MuiThemeProvider>
    );
}

export default InputSliderShadow;
