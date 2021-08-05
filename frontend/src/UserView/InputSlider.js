import React from 'react';
import { makeStyles, MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { Slider, Input, Tooltip, Grid, Typography } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face'
import colors from './colors'

const theme = createTheme({
    overrides: {
        MuiTooltip: {
            tooltip: {
                fontSize: "1em",
                color: "yellow",
                backgroundColor: "grey",
                border: '1px solid #dadde9',
                left:-20,
                top:3,
                maxWidth: 200
            }
        },
        MuiSlider: {
            thumb: {
                height: 20,
                width: 20,
                backgroundColor: "#fff",
                border: "2px solid currentColor",
                marginTop: -10,
                marginLeft: -10,
                boxShadow: "#ebebeb 0 2px 2px",
                "&:focus, &:hover, &$active": {
                    boxShadow: "#ddd 0 2px 3px 1px",
                },
            },
            valueLabel: {
                color: "grey",
                marginLeft: 8
            },
            track: {
                height: 3,
                borderRadius: 2,
                color: 'light-blue'
            },
            rail: {
                color: 'black'
            },
            mark: {
                backgroundColor: 'grey',
                height: 10,
                width: 2,
                marginTop: -3
            },
            markActive: {
                opacity: 1,
                backgroundColor: 'currentColor',
            },
            markLabel: {
                fontSize: 12,
                color: "grey",
                '&[data-index=":)"]': {
                    left: '50%',
                },
                '&[data-index=":D"]': {
                    left: '50%',
                },
                //Style of avg mark should not be affected
                //by active / inactive
                '&[data-index="avg"]': {
                    fontSize: 14,
                    color: "black"
                },
            },
            markLabelActive: {
                fontSize: 14,
                color: "black"
            }
        }
    }
});


function InputSlider(props) {

    const useStyles = makeStyles({})
    const classes = useStyles();

    const { title, surviveValue, thriveValue, startingValue, maxValue, handleOpenDissentModal, userInfo } = props;


    const needsDescription = userInfo.needs_description
    const groupVoteAvg = userInfo.avg_cents / 100

    const marks = [{ value: groupVoteAvg, label: 'avg' }]
    if (surviveValue <= maxValue) {
        marks.push({ value: surviveValue, label: ':)' })
    }
    if (thriveValue <= maxValue) {
        marks.push({ value: thriveValue, label: ':D' })
    }

    function handleSliderChangeCommitted(event, newValue) {
        handleSliderChange(event, newValue, true);
    }

    function handleSliderChange(event, newValue, isVote) {
        props.handleUpdateSlider(props.sliderId, newValue, isVote);
    }

    function handleInputChange(event) {
        const newValue = event.target.value === '' ? '' : Number(event.target.value);
        props.handleUpdateSlider(props.sliderId, newValue, false);
    }

    function handleBlur(event) {
        if (props.startingValue < 0) {
            props.handleUpdateSlider(props.sliderId, 0, false);
        } else if (props.startingValue > props.maxValue) {
            props.handleUpdateSlider(props.sliderId, props.maxValue, false);
        } else {
            const newValue = event.target.value === '' ? '' : Number(event.target.value);
            props.handleUpdateSlider(props.sliderId, newValue, true);
        }
    }

    let tipText = `Survive: ${surviveValue}$\nThrive:   ${thriveValue}$`
    if (needsDescription !== '') {
        tipText += `\n\n"${needsDescription}"`
    }

    return (
        <div style={{ marginTop: 16 }}>
            <MuiThemeProvider theme={theme}>
                <Grid
                    className={classes.root}
                    key={props.sliderId.toString() + 'grid'}
                    container
                    direction={"row"}
                    spacing={1}
                >
                    <Grid item xs={2}>
                        <Grid item>
                                <Tooltip
                                    title={<div style={{ whiteSpace: 'pre-line' }}>{tipText}</div>}
                                    aria-label={<div style={{ whiteSpace: 'pre-line' }}>{tipText}</div>}
                                    arrow={true}
                                    placement={'right'}>
                                    <FaceIcon
                                        onClick={() => { handleOpenDissentModal(props.sliderId) }}
                                        fontSize="large"
                                        style={{ color: colors[props.sliderId] }}
                                    />
                                </Tooltip>
                        </Grid>
                        <Grid item>
                            <Typography id={props.sliderId.toString() + "input-slider"}>
                                {title}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={7}>
                        <Slider
                            key={props.sliderId.toString() + 'slider'}
                            min={0}
                            max={maxValue}
                            value={startingValue ? startingValue : 0}
                            onChange={handleSliderChange}
                            onChangeCommitted={handleSliderChangeCommitted}
                            aria-labelledby="input-slider"
                            marks={marks}
                            valueLabelDisplay='on'
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            className={classes.input}
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

export default InputSlider;
