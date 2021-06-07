import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

class CreateRoomForm extends Component {
    constructor(props) {
        super(props);
        this.state = { isSubmitted: false, roomName: '', splittingCents: 0 };
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

        const payload = {
            'room_name': roomName,
            'splitting_cents': splittingCents
        }

        axios
            .post('/api/rooms', payload)
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
            return <Redirect to={{ pathname: "/admin-view" }} />
        }
        return (
            <form onSubmit={(e) => {
                this.handleSubmit(e)
            }}>
                <h3>Create new room:</h3>
                <label> Room name: <input type="text" required value={this.state.roomName} onChange={this.onChangeName} /></label>
                <label> Amount (cents): <input type="number" required min="1" value={this.state.splittingCents} onChange={this.onChangeSplittingCents} /></label>
                <button type="submit" name="Submit">Submit</button>
            </form>
        );
    }
}

export { CreateRoomForm };