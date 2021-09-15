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
        this.originIsCreateForm = sessionStorage['entryPoint'] === 'createForm';
        this.isObserverView =
            sessionStorage['isObserverView'] === 'true' || this.originIsCreateForm;

        this.state = {
            isReady: false,
            isObserverView: this.isObserverView,
        };
    }

    async componentDidMount() {
        function initializeSliderValues(roomInfo, voterId) {
            let currentValues = {};
            roomInfo.recipients.forEach((recipientData) => {
                const recipientId = recipientData.recipient_id;
                const recipientVoterIds = Object.keys(recipientData.votes_cents);
                if (recipientVoterIds.includes(`${voterId}`)) {
                    const voteValue = recipientData.votes_cents[voterId] / 100;
                    currentValues[recipientId] = voteValue;
                }
            });

            const iniSliderValues = {
                reset: false,
                currentValues: currentValues,
                history: {
                    index: 0,
                    states: [currentValues],
                },
            };

            sessionStorage.setItem('sliderGridState', JSON.stringify(iniSliderValues));
        }

        async function voterJoinRequest(roomCode, path) {
            const payload = { path: path };
            await axios
                .post(`/api/${roomCode}/voterJoin`, payload)
                .then((response) => {
                    if (response.status === 200) {
                        const path = response.data.path;
                        const voterId = response.data.voter_id;
                        const roomInfo = response.data.room_info;

                        sessionStorage.clear();
                        sessionStorage.setItem('path', path);
                        sessionStorage.setItem('voterId', voterId);
                        sessionStorage.setItem('roomInfo', JSON.stringify(roomInfo));
                        initializeSliderValues(roomInfo, voterId);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        async function joinRoomRequest(roomCode) {
            await axios.post(`/api/${roomCode}/join`, {}).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    const roomInfo = response.data;
                    sessionStorage.clear();
                    sessionStorage.setItem('roomInfo', JSON.stringify(roomInfo));
                }
            });
        }

        const roomCode = this.props.match.params.roomCode;
        const path = this.props.match.params.path;

        try {
            const cachedRoomInfo = JSON.parse(sessionStorage.getItem('roomInfo'));
            const cachedRoomCode = cachedRoomInfo ? cachedRoomInfo.room_code : '';
            if (cachedRoomCode !== roomCode) {
                await joinRoomRequest(roomCode);
                sessionStorage.setItem('entryPoint', 'link');
            }
        } catch {
            await joinRoomRequest(roomCode);
        }

        const cachedPath = sessionStorage.getItem('path');
        if (path && path !== cachedPath) {
            await voterJoinRequest(roomCode, path);
        }

        this.setState({ isReady: true });
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
