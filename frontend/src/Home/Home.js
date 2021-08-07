import React, { Component } from 'react';
import { Container, ButtonGroup, Button } from '@material-ui/core'
import {HomeModal as Modal} from './Modal/Modal'


class Home extends Component {

    constructor() {
        super()
        this.state = {
            showCreateRoomModal: false,
            showJoinRoomModal: false
        }
    }

    componentDidMount() {
        document.title = 'GiftHub Distributor';
    }

    showCreateRoomModal = () => {
        this.setState({ showCreateRoomModal: true })
    }

    hideCreateRoomModal = () => {
        this.setState({ showCreateRoomModal: false })
    }

    showJoinRoomModal = () => {
        this.setState({ showJoinRoomModal: true })
    }

    hideJoinRoomModal = () => {
        this.setState({ showJoinRoomModal: false })
    }

    render() {

        return (
            <Container>
                <ButtonGroup
                    color="primary"
                    aria-label="outlined primary button group"
                >
                    <Button
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={() => this.showCreateRoomModal()}>
                        Create Room
                    </Button>
                    <Modal
                        modalTitle="Create Room"
                        show={this.state.showCreateRoomModal}
                        handleClose={this.hideCreateRoomModal}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={() => this.showJoinRoomModal()}>
                        Join Room
                    </Button>
                    <Modal
                        modalTitle="Join Room"
                        show={this.state.showJoinRoomModal}
                        handleClose={this.hideJoinRoomModal}
                    />
                </ButtonGroup>
            </Container >
        );
    }
}

export default Home
