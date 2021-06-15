import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import FaceIcon from '@material-ui/icons/Face';


const placeholderMaxValue = 300

const useStyles = makeStyles({
    root: {
        width: 750,
    },
    input: {
        width: placeholderMaxValue.toString().length+'em'
    },
});

function InputSlider(props) {

    const classes = useStyles();
    const {
        title,
        surviveAmountCents,
        thriveAmountCents,
        startingValueCents,
        maxValueCents
    } = props

    const surviveAmount = surviveAmountCents / 100
    const thriveAmount = thriveAmountCents / 100
    const startingValue = startingValueCents / 100
    const maxValue = maxValueCents / 100

    const marks = [
        {
            value: surviveAmount,
            label: ':)'
        },
        {
            value: thriveAmount,
            label: ':D'
        }
    ]

    const [value, setValue] = React.useState(startingValue);

    // Infinity re-render
    //setValue(startingValue);
    // --> Maybe use class component instead of this for sliders???


    console.log('startingValue' + startingValue)
    console.log('maxValue' + maxValue)
    console.log('marks' + JSON.stringify(marks))
    console.log('props' + JSON.stringify(props))

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > maxValue) {
            setValue(maxValue);
        }
    };

    return (
        <div className={classes.root}>
            <Typography id="input-slider" gutterBottom>
                {props.title}
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <FaceIcon />
                </Grid>
                <Grid item xs>
                    <Slider
                        min={0}
                        max={maxValue}
                        value={typeof value === 'number' ? value : 0}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        marks={marks}
                    />
                </Grid>
                <Grid item>
                    <Input
                        className={classes.input}
                        value={value}
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