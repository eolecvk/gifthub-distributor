import React, { Component } from 'react';
import { Grid, ButtonGroup, Button } from '@material-ui/core';
import { HomeModal } from './Modal/Modal';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            showCreateRoomModal: false,
            showJoinRoomModal: false,
        };
    }

    componentDidMount() {
        document.title = 'GiftHub Distributor';
    }

    showCreateRoomModal = () => {
        this.setState({ showCreateRoomModal: true });
    };

    hideCreateRoomModal = () => {
        this.setState({ showCreateRoomModal: false });
    };

    showJoinRoomModal = () => {
        this.setState({ showJoinRoomModal: true });
    };

    hideJoinRoomModal = () => {
        this.setState({ showJoinRoomModal: false });
    };

    render() {
        return (
            <Grid
                container
                margin="auto"
                display="flex"
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <ButtonGroup
                    orientation="vertical"
                    color="primary"
                    aria-label="outlined primary button group"
                >
                    <Button
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={() => this.showCreateRoomModal()}
                    >
                        Create Room
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={() => this.showJoinRoomModal()}
                    >
                        Join Room
                    </Button>
                    <HomeModal
                        modalTitle="Create Room"
                        show={this.state.showCreateRoomModal}
                        handleClose={this.hideCreateRoomModal}
                    />
                    <HomeModal
                        modalTitle="Join Room"
                        show={this.state.showJoinRoomModal}
                        handleClose={this.hideJoinRoomModal}
                    />
                </ButtonGroup>
            </Grid>
        );
    }
}

export default Home;
