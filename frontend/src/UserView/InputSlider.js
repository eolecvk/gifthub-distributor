import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import FaceIcon from '@material-ui/icons/Face';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import colors from './colors'

import DissentModal from './DissentModal'

function InputSlider(props) {

    const [openDissentModal, setOpenDissentModal] = React.useState(false);
    console.log(openDissentModal)


    const useStyles = makeStyles({})
    const classes = useStyles();
    // const useStyles = makeStyles({
    //     root: {
    //         width: '85%',
    //         height: '100%',
    //         marginTop:'50px'
    //     },
    //     input: {
    //         width: `${props.maxValue.toString().length} em`,
    //     },
    // });

    const { title, surviveValue, thriveValue, startingValue, maxValue, userInfo } = props;


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
        props.handleUpdateSlider(props.sliderId, newValue, true);
    }

    function handleBlur() {
        if (props.startingValue < 0) {
            props.handleUpdateSlider(props.sliderId, 0, false);
        } else if (props.startingValue > props.maxValue) {
            props.handleUpdateSlider(props.sliderId, props.maxValue, false);
        }
    }

    function handleOpenDissentModal() {
        setOpenDissentModal(true)
        console.log(openDissentModal)
    }



    return (
        <div className={classes.root} key={props.sliderId.toString() + "div"}>
            <Grid container spacing={2}>
                <Grid container item>
                    <Grid item>
                        <Typography id={props.sliderId.toString() + "input-slider"}>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Tooltip
                            title={needsDescription}
                            aria-label={needsDescription}>
                            <FaceIcon
                                onClick={() => { handleOpenDissentModal(); console.log('clicked face') }}
                                fontSize="large"
                                style={{ color: colors[props.sliderId] }}
                            />
                        </Tooltip>
                    </Grid>
                </Grid>
                <Grid item>
                    <Slider
                        min={0}
                        max={maxValue}
                        value={startingValue ? startingValue : 0}
                        onChange={handleSliderChange}
                        onChangeCommitted={handleSliderChangeCommitted}
                        aria-labelledby="input-slider"
                        marks={marks}
                        valueLabelDisplay='auto'
                    />
                </Grid>
                <Grid item>
                    <Input
                        className={classes.input}
                        value={startingValue ? startingValue : 0}
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
