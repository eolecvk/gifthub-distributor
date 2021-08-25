import React, { Component } from 'react';
import ObserverView from '../ObserverView/ObserverView';
import ParticipantView from './ParticipantView';
import { Switch, FormControlLabel } from '@material-ui/core';

class ParticipantViewSwitch extends Component {
    constructor() {
        super();
        this.state = {
            observerView:
                sessionStorage.getItem('originIsCreateForm') === 'true'
                    ? true
                    : false,
        };
    }

    handleSwitchObserverView = () => {
        sessionStorage.setItem('originIsCreateForm', !this.state.observerView)
        this.setState({ observerView: !this.state.observerView });
    };

    render() {
        const view = this.state.observerView ? <ObserverView /> : <ParticipantView />;

        return (
            <div>
                <div style={{ float: 'right' }}>
                    <FormControlLabel
                        label="Observer view"
                        control={
                            <Switch
                                name="observerMode"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                checked={this.state.observerView}
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
