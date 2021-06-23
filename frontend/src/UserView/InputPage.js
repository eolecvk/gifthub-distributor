import React, { Component } from 'react'
import { withCookies } from "react-cookie";
//import roomInfo from './roomInfoCookie';
import RoomInfo from './RoomInfo';
import ButtonUpdateDefaultDistribution from './ButtonUpdateDefaultDistribution'
import SlidersGrid from './SliderGrid';
import { getSlidersInitializationData, getStartingValues } from './utils'


class InputPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            defaultDistribution: 'zero',
            reset: false,
            roomInfo: this.props.cookies.get("roomInfo") || ""
        }
    }

    updateDefaultDistribution = (defaultDistribution) => {

        const roomInfo = this.state.roomInfo

        // Upon clicking a default distribution button...
        const futureSlidersInitializationData = getSlidersInitializationData(roomInfo, defaultDistribution)
        const futureStartingValues = getStartingValues(futureSlidersInitializationData)
        const futureTotalCost = Object.values(futureStartingValues).reduce((a, b) => (a + b))
        const roomAmount = roomInfo.splitting_cents / 100

        // ...checks if newDefaultDistribution yields an invalid state before transitioning
        if (futureTotalCost <= roomAmount) {
            this.setState({
                defaultDistribution: defaultDistribution,
                reset: true
            })
        } else {
            alert("Not enough money to set this distribution: " + futureTotalCost + "/ " + roomAmount)
        }


    }

    render() {

        const slidersInitializationData = getSlidersInitializationData(
            this.state.roomInfo,
            this.state.defaultDistribution)

        return (
            <div>
                <h1>Input Page</h1>
                <RoomInfo roomInfo={this.state.roomInfo} />
                <ButtonUpdateDefaultDistribution updateDefaultDistribution={this.updateDefaultDistribution} />
                <SlidersGrid
                    key={this.state.defaultDistribution + Date.now()} // force class rendering on defaultDistribution update!
                    distribution={this.state.defaultDistribution}
                    slidersInitializationData={slidersInitializationData}
                    roomAmount={this.state.roomInfo.splitting_cents / 100}
                    reset={this.state.reset}
                />
            </div>
        )
    }
}


export default withCookies(InputPage)