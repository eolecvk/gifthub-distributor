import React from 'react';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import FaceIcon from '@material-ui/icons/Face';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

function InputSliderDev(props) {

    function handleSliderChangeCommitted(event, newValue){
        handleSliderChange(event, newValue, true)
    }

    function handleSliderChange(event, newValue, isVote) {
        props.handleUpdate(props.sliderId, newValue, isVote);
    }

    function handleInputChange(event) {
        const newValue = event.target.value === '' ? '' : Number(event.target.value);
        props.handleUpdate(props.sliderId, newValue, true);
    }

    function handleBlur() {
        if (props.startingValue < 0) {
            props.handleUpdate(props.sliderId, 0, false);
        } else if (props.startingValue > props.maxValue) {
            props.handleUpdate(props.sliderId, props.maxValue, false);
        }
    }

    const { title, surviveValue, thriveValue, startingValue, maxValue } = props;

    const marks = [
        { value: surviveValue, label: ':)' },
        { value: thriveValue, label: ':D' },
    ];

    return (
        //<div className={classes.root}> <-- ADD FOR STYLING
        <div>
            <Typography id="input-slider" gutterBottom>
                {title}
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <FaceIcon />
                </Grid>
                <Grid item xs>
                    <Slider
                        min={0}
                        max={maxValue}
                        value={startingValue ? startingValue : 0}
                        onChange={handleSliderChange}
                        onChangeCommitted={handleSliderChangeCommitted}
                        aria-labelledby="input-slider"
                        marks={marks}
                    />
                </Grid>
                <Grid item>
                    <Input
                        // className={classes.input}
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

export default InputSliderDev;
