import React, {Component} from 'react'

class CreateRoomForm extends Component {
    constructor(props) {
        super(props);
        this.state = { roomName: '', distributionCents: 0 };
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDistributionCents = this.onChangeDistributionCents.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    resetFieldValues = () => {
        this.setState({ roomName: '', distributionCents: 0 });
    }

    onChangeName = (event) => {
        this.setState({ roomName: event.target.value })
    }

    onChangeDistributionCents = (event) => {
        this.setState({ distributionCents: event.target.value })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { roomName, distributionCents } = this.state;
        alert(`Your registration detail: \n 
        Room name: ${roomName} \n 
        Amount (cents): ${distributionCents}`);
        this.resetFieldValues();
        event.target.reset();
    }

    handleCancel = (event) => {
        event.preventDefault();
        this.setState({ roomName: '', distributionCents: 0 });
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
                <label> Amount (cents): <input type="number" required min="1" value={this.state.distributionCents} onChange={this.onChangeDistributionCents} /></label>
                <button type="submit" name="Submit">Submit</button>
                <button type="submit" name="Cancel">Cancel</button>
            </form>
        );
    }
}


class JoinRoomForm extends Component {
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

    resetFieldValues = () => {
        this.setState({ roomCode: '', userName: '', needMin: 0, needMax: 0 });
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
        event.preventDefault();
        const { roomCode, userName, needMin, needMax } = this.state;
        alert(`User session details: \n
        room code: ${roomCode} \n 
        username: ${userName} \n 
        need min (cents): ${needMin} \n
        need max (cents): ${needMax}`);
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
                <button type="submit" name="Submit">Submit</button>
                <button type="submit" name="Cancel">Cancel</button>
            </form>
        );
    }
}


export { CreateRoomForm, JoinRoomForm };
