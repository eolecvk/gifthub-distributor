import React, { Component } from 'react'
import Modal from 'react-modal'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { withStyles } from "@material-ui/core/styles"
import { CreateRoomForm } from './Forms/CreateRoomForm'
import { JoinRoomForm } from './Forms/JoinRoomForm'

const styles = theme => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
});


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
        const classes = this.props;
        return (
            <div className={classes.root}>
                <ButtonGroup orientation="vertical" color="primary" aria-label="vertical outlined primary button group">
                    <Button name="createRoomButton" onClick={this.handleOpenModalCreateRoom} >New room</Button>
                    <Modal isOpen={this.state.createRoomModalIsOpen} onCloseModal={this.handleCloseModalCreateRoom}>
                        <div class="modal-content">
                            <span class="close" onClick={this.handleCloseModalCreateRoom}>&times;</span>
                            <p>
                                <CreateRoomForm onChange={this.handleCloseModalCreateRoom} />
                            </p>
                        </div>
                    </Modal>
                    <Button name="joinRoomButton" onClick={this.handleOpenModalJoinRoom}>Join room</Button>
                    <Modal isOpen={this.state.joinRoomModalIsOpen} onCloseModal={this.handleCloseModalJoinRoom}>
                        <div class="modal-content">
                            <span class="close" onClick={this.handleCloseModalJoinRoom}>&times;</span>
                            <p>
                                <JoinRoomForm onChange={this.handleCloseModalJoinRoom} />
                            </p>
                        </div>
                    </Modal>
                </ButtonGroup>
            </div>);
    }
}

export default withStyles(styles, { withTheme: true })(HomeMenu);