import React, { Component } from 'react'
import axios from 'axios'

class JoinRoomForm extends Component {
    constructor(props) {
        super(props);
        this.state = { roomCode: '', name: '', needsLowerBoundCents: 0, needsUpperBoundCents: 0, needsDescription: '' };
    }

    resetFieldValues = () => {
        this.setState({ roomCode: '', name: '', needsLowerBoundCents: 0, needsUpperBoundCents: 0, needsDescription: '' });
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

        alert(`User session details: \n
        room code: ${roomCode} \n 
        username: ${name} \n 
        need min (cents): ${needsLowerBoundCents} \n
        need max (cents): ${needsUpperBoundCents} \n
        need description: ${needsDescription}`);

        const payload = {
            name: name,
            needs_description: needsDescription,
            needs_lower_bound_cents: needsLowerBoundCents,
            needs_upper_bound_cents: needsUpperBoundCents
        }


        axios
            .post(`/api/${roomCode}/join`, payload)
            .then(response => { console.log(response) })
            .catch(error => { console.log(error) });

        this.resetFieldValues();
        event.target.reset();
    }

    handleCancel = (event) => {
        event.preventDefault();
        this.resetFieldValues();
        alert(`Returning to selection menu...`);
        event.target.reset();
    }

    render() {
        return (
            <form onSubmit={(e) => {
                const buttonName = e.nativeEvent.submitter.name;
                if (buttonName === "Submit") { this.handleSubmit(e) };
                if (buttonName === "Cancel") { this.handleCancel(e) };
                this.props.onChange(e.target.value);
            }}>
                <h3>Join a room:</h3>
                <label> Room code: <input type="text" required value={this.state.roomCode} onChange={this.onChangeRoomCode} /></label>
                <label> Username: <input type="text" required value={this.state.name} onChange={this.onChangeName} /></label>
                <label> Need min (cents): <input type="number" required min="0" value={this.state.needsLowerBoundCents} onChange={this.onChangeNeedsLowerBoundCents} /></label>
                <label> Need max (cents): <input type="number" required min={this.state.needsLowerBoundCents} value={this.state.needsUpperBoundCents} onChange={this.onChangeNeedsUpperBoundCents} /></label>
                <label> Need description: <input type="text" value={this.state.needsDescription} onChange={this.onChangeNeedsDescription} /></label>
                <button type="submit" name="Submit">Submit</button>
                <button type="submit" name="Cancel">Cancel</button>
            </form>
        );
    }
}


export { JoinRoomForm };