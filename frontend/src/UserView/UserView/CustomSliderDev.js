import React, { Component } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'
import Input from '@material-ui/core/Input'
import FaceIcon from '@material-ui/icons/Face'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

class CustomSliderDev extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: 0,  // is init in getDerivedStateFromProps()
        }
    }


    //Sliders group gets re-renders
    // when a button to set a default distribution is clicked
    // HOWEVER
    // IT SEEMS IT ALSO TRIGGERS WHEN MOVING A SLIDER, PREVENTING MOVING SLIDERS MANUALLY
    // MAYBE USER shouldComponentUpdate to fix this.
    static getDerivedStateFromProps(newProps, prevState) {
        //console.log("GETTING DERIVED STATE FROM PROP")
        return prevState.value === newProps.startingValueCents / 100
            ? {}
            : { value: newProps.startingValueCents / 100 }
    }

    handleSliderChange = (event, newValue) => {
        this.setState({ value: newValue })
    };

    handleInputChange = (event) => {
        this.setState({ value: event.target.value === '' ? '' : Number(event.target.value) })
    };

    handleBlur = () => {
        if (this.state.value < 0) {
            this.setState({ value: 0 })
        } else if (this.state.value > (this.props.maxValueCents / 100)) {
            this.setState({ value: (this.props.maxValueCents / 100) })
        }
    };

    render() {

        // const useStyles = makeStyles({
        //     root: {
        //         width: 750,
        //     },
        //     input: {
        //         width: placeholderMaxValue.toString().length + 'em'
        //     },
        // });

        const title = this.props.title
        const surviveAmount = this.props.surviveAmountCents / 100
        const thriveAmount = this.props.thriveAmountCents / 100
        const maxValue = this.props.maxValueCents / 100
        const marks = [
            { value: surviveAmount, label: ':)' },
            { value: thriveAmount, label: ':D' }
        ]

        // console.log("props: " + JSON.stringify(this.props))

        return (
            //<div className={classes.root}>
            <div>
                <Typography id="input-slider" gutterBottom>
                    {this.props.title}
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <FaceIcon />
                    </Grid>
                    <Grid item xs>
                        <Slider
                            min={0}
                            max={maxValue}
                            value={this.state.value}
                            onChange={this.handleSliderChange}
                            aria-labelledby="input-slider"
                            marks={marks}
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            // className={classes.input}
                            value={this.state.value}
                            margin="dense"
                            onChange={this.handleInputChange}
                            onBlur={this.handleBlur}
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
}

export default CustomSliderDev