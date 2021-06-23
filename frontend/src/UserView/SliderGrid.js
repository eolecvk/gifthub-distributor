import React, { Component } from 'react'
import { withCookies } from "react-cookie";
import { getStartingValues, makeSliderGrid, registerVote } from './utils'

class SliderGrid extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentValues: getStartingValues(this.props.slidersInitializationData),
            reset: this.props.reset,
            roomInfo: this.props.cookies.get("roomInfo") || ""
        }
    }

    handleUpdate = (id, newValue) => {

        let actualNewValue
        actualNewValue = newValue

        let futureState
        futureState = {
            currentValues: { ...this.state.currentValues, [`${id}`]: newValue },
            reset: false
        }
        //Check if future state is valid (sum of money distributed <= totalAmount)
        // If not, distribute as much as possible in the slider moved last
        const futureTotalCost = Object.values(futureState.currentValues).reduce((a, b) => (a + b))

        if (futureTotalCost > this.props.roomAmount) {
            const currentTotalCost = Object.values(this.state.currentValues).reduce((a, b) => (a + b))
            const currentValue = this.state.currentValues[id]
            const maxNewValue = this.props.roomAmount - currentTotalCost + currentValue
            actualNewValue = maxNewValue

            const maxFutureState = {
                currentValues: { ...this.state.currentValues, [`${id}`]: actualNewValue },
                reset: false
            }
            futureState = maxFutureState
        }

        //NEED TO PASS THE roomCode as global Context!
        // roomCode = this.roomInfo.roomCode
        // const roomCode = 'CCCS'
        //registerVote({ [`${id}`]: [`${actualNewValue}`] }, roomCode)
        this.setState(futureState)
    }

    render() {


        const sliders = makeSliderGrid(
            this.props.slidersInitializationData,
            this.state.currentValues,
            this.handleUpdate,
            this.state.reset
        )


        registerVote(this.state.currentValues, this.state.roomInfo.room_code )

        return (
            <div>
                <p>Amount distributed: {
                    Object.values(this.state.currentValues).length > 0 ?
                    Object.values(this.state.currentValues).map(v => v ? v : 0).reduce((a, b) => a + b) :
                    0
                } / {this.props.roomAmount}</p>
                {sliders}
            </div >
        )

    }
}

export default withCookies(SliderGrid)