import React from 'react';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { Slider, Input, Grid } from '@material-ui/core';

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
                height: 3,
                borderRadius: 2,
                color: 'transparent',
            },
            rail: {
                height: 6,
                color: 'black',
                backgroundImage: 'linear-gradient(.25turn, red, green)',
            },
            mark: {
                color: 'black',
                height: 25,
                width: 0.5,
                marginTop: 0,
                '&[data-index="0"]': {
                    height: 6,
                    width: 3,
                    marginTop: 0,
                },
            },
            markActive: {
                opacity: 1,
                backgroundColor: 'currentColor',
            },
            markLabel: {
                fontSize: 12,
                color: 'grey',
                //transform: 'translate(-40%, -20%)',
                transform: 'translate(-40%, 70%)',
                //Style of avg mark
                '&[data-index="0"]': {
                    fontSize: 12,
                    color: 'black',
                    //marginTop: 1,
                    transform: 'translate(-40%, -15%)',
                },
            },
            markLabelActive: {
                fontSize: 12,
                color: 'black',
                fontWeight: 'bold',
                transform: 'translate(-40%, 70%)',
                //transform: 'translate(-40%, -20%)',
                //Style of avg mark
                '&[data-index="0"]': {
                    fontSize: 12,
                    color: 'black',
                    fontWeight: 'normal',
                    transform: 'translate(-40%, -15%)',
                },
            },
        },
    },
});

function InputSliderZoomedView(props) {
    const {
        sliderId,
        startingValue,
    } = props;

    const roomInfo = JSON.parse(sessionStorage.getItem('roomInfo'))
    const recipientInfo = roomInfo.recipients.filter(
        recipientData => recipientData.recipient_id === sliderId
    )[0]

    const maxValue = roomInfo.splitting_cents / 100
    const surviveValue = recipientInfo.needs_lower_bound_cents / 100
    const thriveValue = recipientInfo.needs_upper_bound_cents / 100
    const groupVoteAvg = recipientInfo.avg_cents / 100;

    //maxValue ???
    //startingValue ???

    function getMarks(groupVoteAvg, surviveValue, thriveValue) {
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

        const markAvg = {
            value: groupVoteAvg,
            label: `avg:${groupVoteAvg}`,
        };
        const markSurvive = {
            value: surviveValue,
            label: surviveButton,
        };
        const markThrive = {
            value: thriveValue,
            label: thriveButton,
        };
        marks.push(markAvg);
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
        props.handleUpdateSlider(sliderId, newValue, isVote);
    }

    function handleInputChange(event) {
        const newValue = event.target.value === '' ? '' : Number(event.target.value);
        props.handleUpdateSlider(sliderId, newValue, false);
    }

    function handleBlur(event) {
        if (props.startingValue < 0) {
            props.handleUpdateSlider(sliderId, 0, false);
        } else if (props.startingValue > props.maxValue) {
            props.handleUpdateSlider(sliderId, props.maxValue, false);
        } else {
            const newValue = event.target.value === '' ? '' : Number(event.target.value);
            props.handleUpdateSlider(sliderId, newValue, true);
        }
    }

    // const useStyles = makeStyles({})
    // const classes = useStyles();

    return (
        <div style={{ marginTop: 30 }}>
            <MuiThemeProvider theme={theme}>
                <Grid
                    //className={classes.root}
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
                            value={startingValue ? startingValue : 0}
                            onChange={handleSliderChange}
                            onChangeCommitted={handleSliderChangeCommitted}
                            aria-labelledby={props.sliderId.toString() + 'slider'}
                            marks={getMarks(groupVoteAvg, surviveValue, thriveValue)}
                            valueLabelDisplay="on"
                        />
                    </Grid>

                    <Grid item xs>
                        <Input
                            //className={classes.input}
                            key={props.sliderId.toString() + 'input'}
                            value={startingValue !== '' ? startingValue : ''}
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
    );
}

export default InputSliderZoomedView;
