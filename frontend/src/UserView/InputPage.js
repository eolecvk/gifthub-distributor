import React, { Component } from 'react'
//import { useCookies } from "react-cookie"
import roomInfo from './roomInfoCookie';
import RoomInfo from './RoomInfo';
import ButtonUpdateDefaultDistribution from './ButtonUpdateDefaultDistribution'
import SlidersGrid from './SliderGrid';
import { getSlidersInitializationData } from './utils'


class InputPage extends Component {
    constructor() {
        super()
        this.state = {
            defaultDistribution: 'zero',
            reset: false
        }
    }

    updateDefaultDistribution = (defaultDistribution) => {
        this.setState({
            defaultDistribution: defaultDistribution,
            reset: true
        })
    }

    render() {
        //const [cookies, setCookie] = useCookies(["roomInfo"]);
        // const roomInfo = cookies.roomInfo

        const slidersInitializationData = getSlidersInitializationData(roomInfo, this.state.defaultDistribution)

        return (
            <div>
                <h1>Input Page</h1>
                <RoomInfo roomInfo={roomInfo} />
                <ButtonUpdateDefaultDistribution updateDefaultDistribution={this.updateDefaultDistribution} />
                <SlidersGrid
                    key={this.state.defaultDistribution} // force class rendering on defaultDistribution update!
                    distribution={this.state.defaultDistribution}
                    slidersInitializationData={slidersInitializationData}
                    roomInfo={roomInfo}
                    reset={this.state.reset}
                />
            </div>
        )
    }
}


export default InputPage