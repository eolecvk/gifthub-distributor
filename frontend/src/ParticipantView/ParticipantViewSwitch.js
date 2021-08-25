import React, { Component } from 'react';
import ObserverView from '../ObserverView/ObserverView';
import ParticipantView from './ParticipantView';
import { Switch, FormControlLabel } from '@material-ui/core';

class ParticipantViewSwitch extends Component {
    constructor() {
        super();

        this.originIsCreateForm = (sessionStorage['originIsCreateForm'] === 'true')

        this.isObserverView = (typeof sessionStorage['isObserverView'] === 'undefined')
            ? this.originIsCreateForm
            : (sessionStorage['isObserverView'] === 'true')

        this.state = {
            isObserverView: this.isObserverView,
        };
    }

    handleSwitchObserverView = () => {
        sessionStorage.setItem('isObserverView', !this.state.isObserverView)
        this.setState({ isObserverView: !this.state.isObserverView });
    };

    render() {
        const view = this.state.isObserverView ? <ObserverView /> : <ParticipantView />;

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
