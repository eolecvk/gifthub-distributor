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


    handleUpdate = (id, newValue) => {

        const futureState = {
            currentValues: { ...this.state.currentValues, [`${id}`]: newValue },
            reset: false
        }

        //Check if future state is valid (sum of money distributed <= totalAmount)
        const futureTotalCost = Object.values(futureState.currentValues).reduce((a, b) => (a + b))
        if (futureTotalCost <= this.props.roomAmount) {
            this.setState(futureState)

        // If not, distribute as much as possible in the slider moved last
        } else {
            const currentTotalCost = Object.values(this.state.currentValues).reduce((a, b) => (a + b))
            const currentValue = this.state.currentValues[id]
            const maxNewValue = this.props.roomAmount - currentTotalCost + currentValue
            const maxFutureState = {
                currentValues: { ...this.state.currentValues, [`${id}`]: maxNewValue },
                reset: false
            }
            this.setState(maxFutureState)
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