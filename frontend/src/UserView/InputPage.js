import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
//import roomInfo from './roomInfoCookie';
import axios from 'axios';
import RoomInfo from './RoomInfo';
import ButtonUpdateDefaultDistribution from './ButtonUpdateDefaultDistribution';
import SlidersGrid from './SliderGrid';
import { getSlidersInitializationData, getStartingValues } from './utils';

class InputPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultDistribution: 'zero',
            reset: false,
            roomInfo: this.props.cookies.get('roomInfo') || ''
        };
    }
    intervalID;

    componentDidMount() {
        this.getData()
    }

    componentWillUnmount() {
        clearTimeout(this.intervalID)
    }

    getData = () => {
        axios.get('/api/' + this.state.roomInfo.room_code).then((response) => {
            if (response.data.people.length !== this.state.roomInfo.people.length) {
                this.setState({ roomInfo: response.data, reset: true });
            }
            // call getData() again in 5 seconds
            this.intervalID = setTimeout(this.getData.bind(this), 5000);
        })
    }

    // NEED TO MOVE THIS TO UTILS
    // Generate updated version of state `currentState`
    // when inserting a new move of `newValue` at sliderId `id`
    getStateObjectNewMoves = (currentState, newSliderValues) => {
        return {
            currentValues: { ...newSliderValues }, // NEED TO DEPRECATED THIS
            reset: false,
            history: {
                index: currentState.history.index + 1,
                states: [
                    ...currentState.history.states.slice(0, currentState.history.index + 1),
                    { ...newSliderValues }
                ]
            }
        }
    }

    updateDefaultDistribution = (defaultDistribution) => {
        const roomInfo = this.state.roomInfo;

        // Upon clicking a default distribution button...
        const futureSlidersInitializationData = getSlidersInitializationData(
            roomInfo,
            defaultDistribution
        );
        const futureStartingValues = getStartingValues(futureSlidersInitializationData);
        const futureTotalCost = Object.values(futureStartingValues).reduce((a, b) => a + b);
        const roomAmount = roomInfo.splitting_cents / 100;

        // ...checks if newDefaultDistribution yields an invalid state before transitioning
        if (futureTotalCost > roomAmount) {
            alert('Not enough money to set this distribution: ' + futureTotalCost + '/ ' + roomAmount)
            return
        }

        // Update grid state stored in memory (will be used for slider grid initialization upon re-rendering)
        const storedSliderGridState = JSON.parse(sessionStorage.getItem("sliderGridState"))
        const defaultSliderGridState = {
            currentValues: futureStartingValues, // NEED TO DEPRECATED THIS
            reset: false,
            history: {
                index: 0,
                states: [futureStartingValues]
            }
        }
        const currentSliderGridState = storedSliderGridState || defaultSliderGridState
        const futureSliderGridState = this.getStateObjectNewMoves(currentSliderGridState, futureStartingValues)
        sessionStorage.setItem("sliderGridState", JSON.stringify(futureSliderGridState))

        this.setState({
            defaultDistribution: defaultDistribution,
            reset: true,
        });
    }

    render() {
        const slidersInitializationData = getSlidersInitializationData(
            this.state.roomInfo,
            this.state.defaultDistribution
        );

        return (
            <div>
                <RoomInfo
                    roomInfo={this.state.roomInfo}
                />
                <ButtonUpdateDefaultDistribution
                    updateDefaultDistribution={this.updateDefaultDistribution}
                />
                <SlidersGrid
                    key={this.state.defaultDistribution + Date.now()} // force class rendering on defaultDistribution update!
                    distribution={this.state.defaultDistribution}
                    slidersInitializationData={slidersInitializationData}
                    roomInfo={this.state.roomInfo}
                    roomAmount={this.state.roomInfo.splitting_cents / 100}
                    reset={this.state.reset}
                />
            </div>
        );
    }
}

export default withCookies(InputPage);
