import React, { Component } from 'react'
import axios from 'axios'

class JoinRoomForm extends Component {
    constructor(props) {
        super(props);
        this.state = { roomCode: '', userName: '', needMin: 0, needMax: 0, needDescription: '' };
        // this.onChangeRoomCode = this.onChangeRoomCode.bind(this);
        // this.onChangeUserName = this.onChangeUserName.bind(this);
        // this.onChangeNeedMin = this.onChangeNeedMin.bind(this);
        // this.onChangeNeedMax = this.onChangeNeedMax.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleCancel = this.handleCancel.bind(this);
    }

    resetFieldValues = () => {
        this.setState({ roomCode: '', userName: '', needMin: 0, needMax: 0, needDescription: '' });
    }


    onChangeRoomCode = (event) => {
        this.setState({ roomCode: event.target.value })
    }

    onChangeUserName = (event) => {
        this.setState({ userName: event.target.value })
    }

    onChangeNeedMin = (event) => {
        this.setState({ needMin: event.target.value })
    }

    onChangeNeedMax = (event) => {
        this.setState({ needMax: event.target.value })
    }

    onChangeNeedDescription = (event) => {
        this.setState({ needDescription: event.target.value })
    }

    // Refactor (onChangeRoomCode, onChangeUserName, ...)to:
    // changeHandler = e => {
    //     this.setState({e.target.name]: e.target.value})
    // }

    handleSubmit = (event) => {
        event.preventDefault();
        const { roomCode, userName, needMin, needMax, needDescription } = this.state;

        alert(`User session details: \n
        room code: ${roomCode} \n 
        username: ${userName} \n 
        need min (cents): ${needMin} \n
        need max (cents): ${needMax} \n
        need description: ${needDescription}`);

        const payload = {
            name: userName,
            needs_description: needDescription,
            needs_upper_bound_cents: needMin,
            needs_lower_bound_cents: needMax
        }


        axios
            .get(`/api/${roomCode}/join`, payload)
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
                <label> Username: <input type="text" required value={this.state.userName} onChange={this.onChangeUserName} /></label>
                <label> Need min (cents): <input type="number" required min="0" value={this.state.needMin} onChange={this.onChangeNeedMin} /></label>
                <label> Need max (cents): <input type="number" required min={this.state.needMin} value={this.state.needMax} onChange={this.onChangeNeedMax} /></label>
                <label> Need description: <input type="text" value={this.state.needDescription} onChange={this.onChangeNeedDescription} /></label>
                <button type="submit" name="Submit">Submit</button>
                <button type="submit" name="Cancel">Cancel</button>
            </form>
        );
    }
}


export { JoinRoomForm };