import React, { Component } from 'react'
import { getStartingValues, makeSliderGrid } from './utils'


class SliderGrid extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentValues: getStartingValues(this.props.slidersInitializationData),
            reset : this.props.reset
        }
    }

    handleUpdate = (id, newValue) => {
        this.setState(
            {
                currentValues: {
                    ...this.state.currentValues,
                    [`${id}`]: newValue,
                },
                reset : false
            }
        )
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
                } / {this.props.roomInfo.splitting_cents / 100}</p>
                {sliders}
            </div >
        )

    }
}

export default SliderGrid