import React, { Component } from 'react';
import axios from 'axios';
import isEqual from 'lodash.isequal';
import RoomInfo from './RoomInfo';
import SlidersGrid from './SliderGrid';
import EditableInfoModal from './EditableInfoModal';
import {
    getNeedsScaleDownRatio,
    getSlidersInitializationData,
    getStartingValues,
    ,
} from './utils';

class ParticipantViewHollow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomInfo: JSON.parse(sessionStorage.getItem('roomInfo')) || '',
        };
    }
    intervalID;

    componentDidMount() {
        document.title = 'Participant';
        this.getData();
    }

    componentWillUnmount() {
        clearTimeout(this.intervalID);
    }

    getData = () => {
        axios.get('/api/' + this.state.roomInfo.room_code).then((response) => {
            // Case:  roomInfo has changed either because of new people or because avg has moved somewhere
            if (!isEqual(this.state.roomInfo, response.data)){
                this.setState({ roomInfo: response.data });
            }

            //Always update the local representation of room info
            sessionStorage.setItem('roomInfo', JSON.stringify(response.data));

            // call getData() again in 5 seconds
            this.intervalID = setTimeout(this.getData.bind(this), 2000);
        });
    };

    render() {
        const slidersInitializationData = getSlidersInitializationData(
            this.state.roomInfo,
            this.state.defaultDistribution
        );

        return (
            <div>
                <RoomInfo roomInfo={this.state.roomInfo} />
                <button onClick={()=>{console.log('join as voter')}}>Join as voter</button>
                {/* Replace with <JoinAsVoterModal/> */}
                <SlidersGrid
                    key={this.state.defaultDistribution + Date.now()} // force class rendering on defaultDistribution update!
                    distribution={this.state.defaultDistribution}
                    slidersInitializationData={slidersInitializationData}
                    roomInfo={this.state.roomInfo}
                    roomAmount={this.state.roomInfo.splitting_cents / 100}
                    reset={this.state.reset}
                    dissentModalOpenAtSlider={this.dissentModalOpenAtSlider}
                />
            </div>
        );
    }
}

export default ParticipantViewHollow;
