import React from 'react';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { Slider, Grid } from '@material-ui/core';
import RecipientFace from './RecipientFace';
import { formatAsUSD } from '../utils';

const theme = createTheme({
    overrides: {
        MuiSlider: {
            thumb: {
                height: 20,
                width: 20,
                backgroundColor: '#fff',
                border: '2px solid currentColor',
                marginTop: -8,
                marginLeft: -10,
                boxShadow: '#ebebeb 0 2px 2px',
                '&:focus, &:hover, &$active': {
                    boxShadow: '#ddd 0 2px 3px 1px',
                },
            },
            valueLabel: {
                color: 'grey',
                marginLeft: 4,
                fontSize: 12,
            },
            track: {
                height: 6,
                borderRadius: 2,
                color: 'orange',
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
                backgroundColor: 'orange',
            },
            markLabel: {
                fontSize: 18,
                color: 'grey',
                fontWeight: 'bold',
                transform: 'translate(-40%, 0%)',
            },
            markLabelActive: {
                fontSize: 18,
                color: 'orange',
                fontWeight: 'bold',
                transform: 'translate(-40%, 0%)',
            },
        },
    },
});

function InputSlider(props) {
    const {
        sliderId,
        title,
        surviveValue,
        thriveValue,
        startingValue,
        maxValue,
        handleOpenSingleRecipientView,
        recipientInfo,
    } = props;
    const groupVoteAvg = recipientInfo.avg_cents / 100;

    function getMarks(surviveValue, thriveValue) {
        const marks = [];

        const surviveButton = (
            <span
                onClick={() => {
                    handleSliderChangeCommitted('', surviveValue);
                }}
            >
                :)
            </span>
        );

        const thriveButton = (
            <span
                onClick={() => {
                    handleSliderChangeCommitted('', thriveValue);
                }}
            >
                :D
            </span>
        );

        const markSurvive = {
            value: surviveValue,
            label: surviveButton,
        };

        const markThrive = {
            value: thriveValue,
            label: thriveButton,
        };

        if (surviveValue <= maxValue) {
            marks.push(markSurvive);
        }
        if (thriveValue <= maxValue) {
            marks.push(markThrive);
        }

        return marks;
    }

    function handleSliderChangeCommitted(event, newValue) {
        handleSliderChange(event, newValue, true);
    }

    function handleSliderChange(event, newValue, isVote) {
        props.handleUpdateSlider(props.sliderId, newValue, isVote);
    }

    return (
        <MuiThemeProvider theme={theme}>
            <Grid key={props.sliderId.toString() + 'grid'} container direction={'row'} spacing={8}>
                <Grid container item xs={1}>
                    <RecipientFace
                        sliderId={sliderId}
                        title={title}
                        openSingleRecipientView={handleOpenSingleRecipientView}
                        currentAvg={groupVoteAvg}
                    />
                </Grid>
                <Grid item xs={9}>
                    <Slider
                        key={props.sliderId.toString() + 'slider'}
                        min={0}
                        max={maxValue}
                        value={startingValue ? startingValue : 0}
                        onChange={handleSliderChange}
                        onChangeCommitted={handleSliderChangeCommitted}
                        aria-labelledby={props.sliderId.toString() + 'slider'}
                        marks={getMarks(surviveValue, thriveValue)}
                        valueLabelDisplay="on"
                    />
                </Grid>
            </Grid>
        </MuiThemeProvider>
    );
}

export default InputSlider;
