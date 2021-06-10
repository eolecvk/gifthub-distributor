import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
// import '../style.css'

import './Forms.css' 

class JoinRoomForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitted: false,
            roomCode: '',
            name: '',
            needsLowerBoundCents: 0,
            needsUpperBoundCents: 0,
            needsDescription: ''
        };
    }

    resetFieldValues = () => {
        this.setState({
            roomCode: '',
            name: '',
            needsLowerBoundCents: 0,
            needsUpperBoundCents: 0,
            needsDescription: ''
        });
    }


    onChangeRoomCode = (event) => {
        this.setState({ roomCode: event.target.value })
    }

    onChangeName = (event) => {
        this.setState({ name: event.target.value })
    }

    onChangeNeedsLowerBoundCents = (event) => {
        this.setState({ needsLowerBoundCents: event.target.value })
    }

    onChangeNeedsUpperBoundCents = (event) => {
        this.setState({ needsUpperBoundCents: event.target.value })
    }

    onChangeNeedsDescription = (event) => {
        this.setState({ needsDescription: event.target.value })
    }

    // Refactor (onChangeRoomCode, onChangeUserName, ...)to:
    // changeHandler = e => {
    //     this.setState({e.target.name]: e.target.value})
    // }

    handleSubmit = (event) => {
        event.preventDefault();
        const { roomCode, name, needsLowerBoundCents, needsUpperBoundCents, needsDescription } = this.state;

        const payload = {
            name: name,
            needs_description: needsDescription,
            needs_lower_bound_cents: needsLowerBoundCents,
            needs_upper_bound_cents: needsUpperBoundCents
        }

        axios
            .post(`/api/${roomCode}/join`, payload)
            .then(response => {
                if (response.status === 200) {
                    this.setState({ isSubmitted: true })
                }
            })
            .catch(error => { console.log(error) });

        this.resetFieldValues();
        event.target.reset();
    }

    render() {
        if (this.state.isSubmitted) {
            return <Redirect to={{ pathname: "/input-page" }} />
        }
        else {
            return (
                <form
                    onSubmit={(e) => {
                        this.handleSubmit(e);
                    }}>

                    <h3>Join a room:</h3>

                    <label> Room code:
                        <input
                            type="text"
                            required
                            value={this.state.roomCode}
                            onChange={this.onChangeRoomCode} />
                    </label>

                    <label> Username:
                        <input
                            type="text"
                            required
                            value={this.state.name}
                            onChange={this.onChangeName} />
                    </label>

                    <label> Need min (cents):
                        <input type="number"
                            required
                            min="0"
                            value={this.state.needsLowerBoundCents}
                            onChange={this.onChangeNeedsLowerBoundCents} />
                    </label>

                    <label> Need max (cents):
                        <input type="number"
                            required
                            min={this.state.needsLowerBoundCents}
                            value={this.state.needsUpperBoundCents}
                            onChange={this.onChangeNeedsUpperBoundCents} />
                    </label>

                    <label> Need description:
                        <input type="text"
                            value={this.state.needsDescription}
                            onChange={this.onChangeNeedsDescription} />
                    </label>

                    <button
                        type="submit"
                        name="Submit">Submit
                    </button>

                </form>
            );
        }
    }
}

export { JoinRoomForm };