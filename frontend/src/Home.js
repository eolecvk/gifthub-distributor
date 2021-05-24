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
                <label> Room name: <input type="text" required value={this.state.roomName} onChange={this.onChangeName} /></label>
                <label> Amount (in cents): <input type="number" required min="1" value={this.state.distributionCents} onChange={this.onChangeDistributionCents} /></label>
                <input type="submit" value="Submit" onSubmit={this.handleSubmit} />
                <input type="submit" value="Cancel" onSubmit={this.handleCancel} />
            </form>
        );
    }
}


class JoinRoomForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { roomCode: '', userName: '', needMin: 0, needMax: 0 };
        this.onChangeRoomCode = this.onChangeRoomCode.bind(this);
        this.onChangeUserName = this.onChangeUserName.bind(this);
        this.onChangeNeedMin = this.onChangeNeedMin.bind(this);
        this.onChangeNeedMax = this.onChangeNeedMax.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
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

    handleSubmit = (event) => {
        event.preventDefault()
        const { roomCode, userName, needMin, needMax } = this.state
        alert(`User session details: \n
        room code: ${roomCode} \n 
        username: ${userName} \n 
        need min (cents): ${needMin} \n
        need max (cents): ${needMax}`)
    }

    handleCancel = (event) => {
        event.preventDefault()
        this.state = { roomCode: '', userName: '', needMin: 0, needMax: 0 };
        alert(`Returning to selection menu...`)
    }

    render() {
        return (
            <form>
                <h3>Join a room:</h3>
                <label> Room code: <input type="text" required value={this.state.roomCode} onChange={this.onChangeRoomCode} /></label>
                <label> Username: <input type="text" required value={this.state.userName} onChange={this.onChangeUserName} /></label>
                <label> Need min (cents): <input type="number" required min="0" value={this.state.needMin} onChange={this.onChangeNeedMin} /></label>
                <label> Need max (cents): <input type="number" required min={this.state.needMin} value={this.state.needMax} onChange={this.onChangeNeedMax} /></label>
                <input type="submit" value="Submit" onSubmit={this.handleSubmit} />
                <input type="submit" value="Cancel" onSubmit={this.handleCancel} />
            </form>
        );
    }
}



function Home() {
    return (
        // <h1>Welcome to the Money Pot</h1>
        <div>
            <CreateRoomForm></CreateRoomForm>
            <JoinRoomForm></JoinRoomForm>
        </div>
    )
}
export default Home;
