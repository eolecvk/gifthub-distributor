import React, { Component } from 'react';
import axios from 'axios';
import isEqual from 'lodash.isequal';
import RoomInfo from './RoomInfo';
import SlidersGridShadow from './SliderGridShadow';
import JoinAsVoterModal from './JoinAsVoterModal';
import { getSlidersInitializationData } from './utils';
import RecipientModal from './RecipientModal';
import AddRecipientModal from './AddRecipientModal';
import { ButtonGroup, Grid } from '@material-ui/core';
import CustomButton from '../CustomButton';

class ParticipantViewShadow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomInfo: JSON.parse(sessionStorage.getItem('roomInfo')),
            defaultDistribution: 'shadow',
            recipientModalOpenAtSlider: '',
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
            // Case:  roomInfo has changed either because of new recipient or because avg has moved somewhere
            if (!isEqual(this.state.roomInfo, response.data)) {
                this.setState({ roomInfo: response.data });
            }

            //Always update the local representation of room info
            sessionStorage.setItem('roomInfo', JSON.stringify(response.data));

            // call getData() again in 5 seconds
            this.intervalID = setTimeout(this.getData.bind(this), 2000);
        });
    };

    openRecipientModal = (sliderId) => {
        this.setState({
            ...this.state,
            recipientModalOpenAtSlider: sliderId === '' ? '' : parseInt(sliderId),
        });
    };

    closeRecipientModal = () => {
        this.openRecipientModal('');
    };

    render() {
        const slidersInitializationData = getSlidersInitializationData(
            this.state.roomInfo,
            this.state.defaultDistribution
        );

        return (
            <div>
                <RoomInfo roomInfo={this.state.roomInfo} />
                <JoinAsVoterModal roomCode={this.state.roomInfo.room_code} />
                <SlidersGridShadow
                    key={this.state.defaultDistribution + Date.now()} // force class rendering on defaultDistribution update!
                    distribution={this.state.defaultDistribution}
                    slidersInitializationData={slidersInitializationData}
                    roomInfo={this.state.roomInfo}
                    reset={this.state.reset}
                    openRecipientModal={this.openRecipientModal}
                />
                <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    style={{ marginTop: 40 }}
                ></Grid>
                <AddRecipientModal roomCode={this.state.roomInfo.room_code} />
                <RecipientModal
                    recipientId={this.state.recipientModalOpenAtSlider}
                    closeRecipientModal={this.closeRecipientModal}
                />
            </div>
        );
    }
}

export default ParticipantViewShadow;
