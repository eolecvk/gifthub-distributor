import React, { Component } from 'react';
import axios from 'axios';
import ObserverView from '../ObserverView/ObserverView';
import ParticipantView from './ParticipantView';
import ParticipantViewShadow from './ParticipantViewShadow';
import { Switch, FormControlLabel } from '@material-ui/core';

class ParticipantViewSwitch extends Component {
    constructor(props) {
        super(props);

        this.originIsCreateForm = sessionStorage['originIsCreateForm'] === 'true';

        this.isObserverView =
            typeof sessionStorage['isObserverView'] === 'undefined'
                ? this.originIsCreateForm
                : sessionStorage['isObserverView'] === 'true';

        this.state = {
            isReady: false,
            isObserverView: this.isObserverView,
        };
    }

    async componentDidMount() {
        if (!sessionStorage.getItem('roomInfo')) {
            await axios.get('/api/' + this.props.match.params.roomCode).then((response) => {
                sessionStorage.setItem('roomInfo', JSON.stringify(response.data));
            });
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

        let view = <ObserverView />;
        if (!this.state.isObserverView) {
            view = <ParticipantViewShadow />;
            const path = sessionStorage['path'];
            if (path !== 'undefined' && typeof path !== 'undefined') {
                view = <ParticipantView />;
            }
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
