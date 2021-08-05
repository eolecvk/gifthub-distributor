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
                display: "block"
            }
        }
    }
});


function InputSlider(props) {

    const useStyles = makeStyles({
        root: {
            '& .MuiTooltip-tooltip': {
                fontSize: 24
            }
        }
    })
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
    if (needsDescription !== ''){
        tipText += `\n\n"${needsDescription}"`
    }

    const tipTitle = (
        <span style={{ whiteSpace: 'pre' }}>
            {tipText}
        </span>)

    return (
        <div style={{ marginTop: 16 }}>
            <Grid
                className={classes.root}
                key={props.sliderId.toString() + 'grid'}
                container
                direction={"row"}
                spacing={2}
            >
                <Grid item xs={1}>
                    <Grid item>
                        <MuiThemeProvider theme={theme}>
                            <Tooltip
                                title={tipTitle}
                                aria-label={tipTitle}
                                arrow={true}
                                placement={'right-end'}>
                                <FaceIcon
                                    onClick={() => { handleOpenDissentModal(props.sliderId) }}
                                    fontSize="large"
                                    style={{ color: colors[props.sliderId] }}
                                />
                            </Tooltip>
                        </MuiThemeProvider>
                    </Grid>
                    <Grid item>
                        <Typography id={props.sliderId.toString() + "input-slider"}>
                            {title}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={9}>
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
                <Grid item xs={1}>
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
        </div>
    );
}

export default InputSlider;
