import React from 'react';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { Slider, Grid } from '@material-ui/core';
import RecipientFace from './RecipientFace'

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
                width: 0
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
    const needsDescription = recipientInfo.needs_description;
    const groupVoteAvg = recipientInfo.avg_cents / 100;

    function getMarks(groupVoteAvg, surviveValue, thriveValue) {
        const marks = [];
        const markAvg = {
            value: groupVoteAvg,
            label: `avg:${groupVoteAvg}`,
        };
        const markSurvive = {
            value: surviveValue,
            label: ':)',
        };
        const markThrive = {
            value: thriveValue,
            label: ':D',
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
                    <RecipientFace
                        sliderId={sliderId}
                        title={title}
                        openRecipientModal={openRecipientModal}
                    />
                    {/* <Grid item xs={2}>
                        <Grid item>
                            <FaceIcon
                                onClick={handleClickFace}
                                fontSize="large"
                                style={{ color: colors[props.sliderId] }}
                            />
                        </Grid>
                        <Grid item>
                            <Typography id={props.sliderId.toString() + 'input-slider'}>
                                {title}
                            </Typography>
                        </Grid>
                    </Grid> */}
                    <Grid item xs={7}>
                        <Slider
                            key={props.sliderId.toString() + 'slider'}
                            min={0}
                            max={maxValue}
                            value={startingValue ? startingValue : 0}
                            onChange={() => { return null }}
                            onChangeCommitted={() => { return null }}
                            aria-labelledby={props.sliderId.toString() + 'slider'}
                            marks={getMarks(groupVoteAvg, surviveValue, thriveValue)}
                            valueLabelDisplay="off"
                            disabled={true}
                        />
                    </Grid>
                </Grid>
            </MuiThemeProvider>
        </div >
    );
}

export default InputSliderShadow;
