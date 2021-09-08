import React, { Component } from 'react';
import axios from 'axios';
import ObserverView from '../ObserverView/ObserverView';
import ParticipantView from './ParticipantView';
import ParticipantViewShadow from './ParticipantViewShadow';
import { Switch, FormControlLabel } from '@material-ui/core';

class ParticipantViewSwitch extends Component {
    constructor(props) {
        super(props);
        this.path = this.props.match.params.path || sessionStorage.getItem('path');
        this.originIsCreateForm = sessionStorage['originIsCreateForm'] === 'true';
        this.isObserverView =
            sessionStorage['isObserverView'] === 'true' || this.originIsCreateForm;

        this.state = {
            isReady: false,
            isObserverView: this.isObserverView,
        };
    }

    async componentDidMount() {
        async function joinRoomRequest(roomCode) {
            await axios.post(`/api/${roomCode}/join`, {}).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    const roomInfo = response.data;
                    sessionStorage.clear();
                    sessionStorage.setItem('roomInfo', JSON.stringify(roomInfo));
                    sessionStorage.setItem('originIsCreateForm', false);
                }
            });
        }
        // async function refreshRoomInfo(roomCode) {
        //     await axios.get('/api/' + roomCode).then((response) => {
        //         sessionStorage.setItem('roomInfo', JSON.stringify(response.data));
        //     });
        // }

        const roomCode = this.props.match.params.roomCode;
        const cachedRoomInfo = sessionStorage.getItem('roomInfo');
        const cachedRoomCode = cachedRoomInfo ? cachedRoomInfo.room_code : '';

        if (cachedRoomInfo) {
            if (cachedRoomCode === roomCode) {
                this.setState({ isReady: true });
            } else {
                await joinRoomRequest(roomCode);
                this.setState({ isReady: true });
            }
        } else {
            await joinRoomRequest(roomCode);
            this.setState({ isReady: true });
        }
    }

    handleSwitchObserverView = () => {
        sessionStorage.setItem('isObserverView', !this.state.isObserverView);
        this.setState({ isObserverView: !this.state.isObserverView });
    };

    render() {
        //roomInfo not yet loaded
        if (!this.state.isReady) {
            return null;
        }

        let view;
        if (this.state.isObserverView) {
            view = <ObserverView />;
        } else if (this.path) {
            view = <ParticipantView />;
        } else {
            view = <ParticipantViewShadow />;
        }

        return (
            <div>
                <div style={{ float: 'right' }}>
                    <FormControlLabel
                        label="Observer view"
                        control={
                            <Switch
                                name="observerMode"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                checked={this.state.isObserverView}
                                onChange={this.handleSwitchObserverView}
                            />
                        }
                    />
                </div>
                <br />
                <div style={{ marginTop: 25 }}>{view}</div>
            </div>
        );
    }
}

export default ParticipantViewSwitch;
