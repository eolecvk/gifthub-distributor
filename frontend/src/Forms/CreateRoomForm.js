import React, { Component } from 'react'
import axios from 'axios'

class CreateRoomForm extends Component {
    constructor(props) {
        super(props);
        this.state = { roomName: '', splittingCents: 0 };
    }

    resetFieldValues = () => {
        this.setState({ roomName: '', splittingCents: 0 });
    }

    onChangeName = (event) => {
        this.setState({ roomName: event.target.value })
    }

    onChangeSplittingCents = (event) => {
        this.setState({ splittingCents: event.target.value })
    }

    // Refactor (onChangeName, onChangeDistributionCents)to:
    // changeHandler = e => {
    //     this.setState({e.target.name]: e.target.value})
    // }

    handleSubmit = (event) => {
        event.preventDefault();
        const { roomName, splittingCents } = this.state;


        alert(`Your registration detail: \n 
        Room name: ${roomName} \n 
        Amount (cents): ${splittingCents}`);

        const payload = {
            'room_name': roomName,
            'splitting_cents': splittingCents
        }

        axios
            .post('/api/rooms', payload)
            .then(response => { console.log(response) })
            .catch(error => { console.log(error) });

        this.resetFieldValues();
        event.target.reset();
    }

    handleCancel = (event) => {
        event.preventDefault();
        this.setState({ roomName: '', splittingCents: 0 });
        alert(`Returning to selection menu...`);
        this.resetFieldValues();
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
                <h3>Create new room:</h3>
                <label> Room name: <input type="text" required value={this.state.roomName} onChange={this.onChangeName} /></label>
                <label> Amount (cents): <input type="number" required min="1" value={this.state.splittingCents} onChange={this.onChangeSplittingCents} /></label>
                <button type="submit" name="Submit">Submit</button>
                <button type="submit" name="Cancel">Cancel</button>
            </form>
        );
    }
}

export { CreateRoomForm };