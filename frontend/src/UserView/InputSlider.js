import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'
import Input from '@material-ui/core/Input'
import FaceIcon from '@material-ui/icons/Face'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'



function InputSliderDev(props) {

    function handleSliderChange(event, newValue) {
        props.handleUpdate(props.sliderId, newValue)
    };

    function handleInputChange(event) {
        const newValue = event.target.value === '' ?
            '' :
            Number(event.target.value)
        props.handleUpdate(props.sliderId, newValue)
    };

    function handleBlur() {
        if (props.startingValue < 0) {
            props.handleUpdate(props.sliderId, 0)
        } else if (props.startingValue > props.maxValue) {
            props.handleUpdate(props.sliderId, props.maxValue)
        }
        //ADD CONDITION TO LIMIT IF TOTAL > MAX_AMOUNT!
    }

    const {
        peopleId,
        title,
        surviveValue,
        thriveValue,
        startingValue,
        maxValue
    } = props

    const marks = [
        { value: surviveValue, label: ':)' },
        { value: thriveValue, label: ':D' }
    ]


    return (//<div className={classes.root}> <-- ADD FOR STYLING
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
    )
}

export default InputSliderDev