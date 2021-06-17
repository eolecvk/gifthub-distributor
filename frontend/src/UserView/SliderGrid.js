import React, { Component } from 'react'
import { getStartingValues, makeSliderGrid } from './utils'


class SliderGrid extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentValues: getStartingValues(this.props.slidersInitializationData),
            reset: this.props.reset
        }
    }

    isValidState(currentValues, maxAmount) {
        return Object.values(currentValues).reduce((a, b) => (a + b)) <= maxAmount
    }

    handleUpdate = (id, newValue) => {

        const futureState = {
            currentValues: { ...this.state.currentValues, [`${id}`]: newValue },
            reset: false
        }

        if (this.isValidState(futureState.currentValues, this.props.roomAmount)) {
            this.setState(futureState)
        }

    }

    render() {


        const sliders = makeSliderGrid(
            this.props.slidersInitializationData,
            this.state.currentValues,
            this.handleUpdate,
            this.state.reset
        )

        return (
            <div>
                <p>Amount distributed: {
                    Object.values(this.state.currentValues).map(v => v ? v : 0).reduce((a, b) => a + b)
                } / {this.props.roomAmount}</p>
                {sliders}
            </div >
        )

    }
}

export default SliderGrid