import React, { Component } from 'react'
import Modal from 'react-modal'
import { CreateRoomForm, JoinRoomForm } from './Forms'


class HomeMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createRoomModalIsOpen: false,
            joinRoomModalIsOpen: false
        };
    }

    handleOpenModalCreateRoom = (event) => {
        this.setState({ createRoomModalIsOpen: true });
    }

    handleCloseModalCreateRoom = (event) => {
        this.setState({ createRoomModalIsOpen: false });
    }

    handleOpenModalJoinRoom = (event) => {
        this.setState({ joinRoomModalIsOpen: true });
    }

    handleCloseModalJoinRoom = (event) => {
        this.setState({ joinRoomModalIsOpen: false });
    }

    render() {
        return (
            <div>
                <button type="button" name="createRoomButton" onClick={this.handleOpenModalCreateRoom} >New room</button>
                <Modal isOpen={this.state.createRoomModalIsOpen} onCloseModal={this.handleCloseModalCreateRoom}>
                    <div class="modal-content">
                        <span class="close" onClick={this.handleCloseModalCreateRoom}>&times;</span>
                        <p>
                            <CreateRoomForm></CreateRoomForm>
                        </p>
                    </div>
                </Modal>
                <button type="button" name="joinRoomButton" onClick={this.handleOpenModalJoinRoom}>Join room</button>
                <Modal isOpen={this.state.joinRoomModalIsOpen} onCloseModal={this.handleCloseModalJoinRoom}>
                    <div class="modal-content">
                        <span class="close" onClick={this.handleCloseModalJoinRoom}>&times;</span>
                        <p>
                            <JoinRoomForm></JoinRoomForm>
                        </p>
                    </div>
                </Modal>
            </div>);
    }
}


function Home() {
    return (
        <HomeMenu></HomeMenu>
    )
}

export default Home;
