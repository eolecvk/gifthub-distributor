import React, { useEffect, useState } from 'react';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { Slider, Input, Grid } from '@material-ui/core';
import { parseSliderStartingValue, registerVote } from './utils';

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

function InputSliderZoomedView(props) {
    const { sliderId } = props;
    const startingValue = parseSliderStartingValue(sliderId);
    const [currentValue, setCurrentValue] = useState(startingValue);

    useEffect(() => {
        setCurrentValue(parseSliderStartingValue(sliderId));
    }, [sliderId]);

    const roomInfo = JSON.parse(sessionStorage.getItem('roomInfo'));
    const roomCode = roomInfo.room_code;
    const recipientInfo = roomInfo.recipients.filter(
        (recipientData) => recipientData.recipient_id === sliderId
    )[0];

    let maxValue, surviveValue, thriveValue;

    if (recipientInfo) {
        maxValue = roomInfo.splitting_cents / 100;
        surviveValue = recipientInfo.needs_lower_bound_cents / 100;
        thriveValue = recipientInfo.needs_upper_bound_cents / 100;
        //const groupVoteAvg = recipientInfo.avg_cents / 100;
    }

    function getMarks(surviveValue, thriveValue) {
        // removed arg: groupVoteAvg
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

        // const markAvg = {
        //     value: groupVoteAvg,
        //     label: `avg:${groupVoteAvg}`,
        // };
        //marks.push(markAvg);

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
        if (isVote) {
            const sliderValues = { [sliderId]: newValue };
            registerVote(sliderValues, roomCode);
        }
        setCurrentValue(newValue);
    }

    function handleInputChange(event) {
        const newValue = event.target.value === '' ? '' : Number(event.target.value);
        handleSliderChange(event, newValue, false);
    }

    function handleBlur(event) {
        if (props.startingValue < 0) {
            handleSliderChange(sliderId, 0, false);
        } else if (props.startingValue > props.maxValue) {
            handleSliderChange(sliderId, props.maxValue, false);
        } else {
            const newValue = event.target.value === '' ? '' : Number(event.target.value);
            handleSliderChange(sliderId, newValue, true);
        }
    }

    const InputSliderZoomedView = recipientInfo ? (
        <div style={{ marginTop: 60, marginBottom: 40 }}>
            <MuiThemeProvider theme={theme}>
                <Grid
                    key={props.sliderId.toString() + 'grid'}
                    container
                    direction={'row'}
                    spacing={1}
                >
                    <Grid item xs={7}>
                        <Slider
                            key={props.sliderId.toString() + 'slider'}
                            min={0}
                            max={maxValue}
                            value={currentValue}
                            onChange={handleSliderChange}
                            onChangeCommitted={handleSliderChangeCommitted}
                            aria-labelledby={props.sliderId.toString() + 'slider'}
                            marks={getMarks(surviveValue, thriveValue)}
                            valueLabelDisplay="on"
                        />
                    </Grid>

                    <Grid item xs>
                        <Input
                            key={props.sliderId.toString() + 'input'}
                            value={currentValue !== '' ? currentValue : ''}
                            margin="dense"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            inputProps={{
                                step: 1,
                                min: 0,
                                max: maxValue,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Grid>
                </Grid>
            </MuiThemeProvider>
        </div>
    ) : null;

    return InputSliderZoomedView;
}

export default InputSliderZoomedView;
