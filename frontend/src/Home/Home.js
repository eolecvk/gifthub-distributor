import React, { Component } from 'react';
import { Grid, ButtonGroup } from '@material-ui/core';
// import { HomeModal } from './Modal/Modal';
import CreateRoomForm from './Form/CreateRoomForm';
import JoinRoomForm from './Form/JoinRoomForm';
import CustomButton from '../CustomButton';
import CustomModal from '../CustomModal';

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
                    <CustomButton
                        title="Create Room"
                        onClick={this.showCreateRoomModal}
                        size="large"
                    />
                    <CustomButton title="Join Room" onClick={this.showJoinRoomModal} size="large" />
                </ButtonGroup>

                <CustomModal
                    title="Create Room"
                    form={<CreateRoomForm handleClose={this.hideCreateRoomModal} />}
                    handleClose={this.hideCreateRoomModal}
                    show={this.state.showCreateRoomModal}
                />

                <CustomModal
                    title="Join Room"
                    form={<JoinRoomForm handleClose={this.hideJoinRoomModal} />}
                    handleClose={this.hideJoinRoomModal}
                    show={this.state.showJoinRoomModal}
                />
            </Grid>
        );
    }
}

export default Home;
