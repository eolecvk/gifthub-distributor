import React, { Component } from 'react'

//TODO: encapsulate form in a modal
//TODO: Add CREATE ROOM button to display modal
//TODO: Repeat for JOIN ROOM button and modal

class CreateRoomForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { roomName: '', distributionCents: 0 };
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDistributionCents = this.onChangeDistributionCents.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    onChangeName = (event) => {
        this.setState({ roomName: event.target.value })
    }

    onChangeDistributionCents = (event) => {
        this.setState({ distributionCents: event.target.value })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const { roomName, distributionCents } = this.state
        alert(`Your registration detail: \n 
        Room name: ${roomName} \n 
        Amount (cents): ${distributionCents}`)
    }

    handleCancel = (event) => {
        event.preventDefault()
        this.state = { roomName: '', distributionCents: 0 };
        alert(`Returning to selection menu...`)
    }

    render() {
        return (
            <form>
                <h3>Create new room:</h3>
                <label> Name: <input type="text" value={this.state.roomName} onChange={this.onChangeName} /></label>
                <label> Amount (in cents): <input type="number" value={this.state.distributionCents} onChange={this.onChangeDistributionCents} /></label>
                <input type="submit" value="Submit" onSubmit={this.handleSubmit} />
                <input type="submit" value="Cancel" onSubmit={this.handleCancel}/>
            </form>
        );
    }
}



function Home() {
    return (
        // <h1>Welcome to the Money Pot</h1>
        <CreateRoomForm></CreateRoomForm>
    )
}
export default Home;
