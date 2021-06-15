import { Slider } from '@material-ui/core'
import CustomSliderDev from './CustomSliderDev'
import React, { Component } from 'react'

class ButtonAndSlidersDev extends Component {
    constructor() {
        super()
        this.state = {
            sliderLevel: 0
        }
        this.handleClick0 = this.handleClick0.bind(this)
        this.handleClick50 = this.handleClick50.bind(this)
    }

    handleClickZero() {
        
    }
    handleClickEqual() {
        this.setState({ sliderLevel: 50 })
    }


    render() {
        return (
            <div>
                <button onClick={() => this.setState({ sliderLevel: 0 })}>Reset to 0</button>
                <button onClick={this.handleClickEqual}>Equal amounts</button>
                <button onClick={this.handleClickSurvive}>Survive amounts</button>
                <button onClick={this.handleClickThrive}>Thrive amounts</button>
                <CustomSliderDev
                    value={this.state.sliderLevel}
                    maxValue={300}
                    surviveAmount={20}
                    thriveAmount={40}
                />
            </div>
        )
    }
}

export default ButtonAndSlidersDev