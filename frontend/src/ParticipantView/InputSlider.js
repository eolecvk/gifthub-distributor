import React from 'react';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { Slider, Input, Tooltip, Grid, Typography } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import colors from './colors';

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
                height: 6,
                width: 3,
                marginTop: 0,
                '&[data-index="0"]': {
                    height: 25,
                    width: 1,
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
                transform: 'translate(-40%, -20%)',
                //Style of avg mark
                '&[data-index="0"]': {
                    fontSize: 12,
                    color: 'black',
                    //marginTop: 1,
                    transform: 'translate(-40%, 40%)',
                },
            },
            markLabelActive: {
                fontSize: 12,
                color: 'black',
                fontWeight: 'bold',
                transform: 'translate(-40%, -20%)',
                //Style of avg mark
                '&[data-index="0"]': {
                    fontSize: 12,
                    color: 'black',
                    fontWeight: 'normal',
                    transform: 'translate(-40%, 40%)',
                },
            },
        },
    },
});

function InputSlider(props) {
    const {
        title,
        surviveValue,
        thriveValue,
        startingValue,
        maxValue,
        handleOpenDissentModal,
        userInfo,
    } = props;
    const needsDescription = userInfo.needs_description;
    const groupVoteAvg = userInfo.avg_cents / 100;

    function getMarks(groupVoteAvg, surviveValue, thriveValue) {
        const marks = [];
        const markAvg = {
            value: groupVoteAvg,
            label: `avg:${groupVoteAvg}`,
        };
        const markSurvive = {
            value: surviveValue,
            label: surviveValue,
        };
        const markThrive = {
            value: thriveValue,
            label: thriveValue,
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

    function getTipTitle(surviveValue, thriveValue, needsDescription) {
        let tipText = `Survive: ${surviveValue}$\nThrive:   ${thriveValue}$`;
        if (needsDescription !== '') {
            tipText += `\n\n"${needsDescription}"`;
        }
        return <div style={{ whiteSpace: 'pre-line' }}>{tipText}</div>;
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
                    <Grid item xs={2}>
                        <Grid item>
                            <Tooltip
                                title={getTipTitle(surviveValue, thriveValue, needsDescription)}
                                aria-label={getTipTitle(
                                    surviveValue,
                                    thriveValue,
                                    needsDescription
                                )}
                                arrow={true}
                                placement={'right'}
                            >
                                <FaceIcon
                                    onClick={() => {
                                        handleOpenDissentModal(props.sliderId);
                                    }}
                                    fontSize="large"
                                    style={{ color: colors[props.sliderId] }}
                                />
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <Typography id={props.sliderId.toString() + 'input-slider'}>
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
                            aria-labelledby={props.sliderId.toString() + 'slider'}
                            marks={getMarks(groupVoteAvg, surviveValue, thriveValue)}
                            valueLabelDisplay="on"
                        />
                    </Grid>
                    <Grid item>
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

export default InputSlider;
