import React, { Component } from 'react';
import axios from 'axios';
import { TextField, Grid } from '@material-ui/core';
import { withRouter } from 'react-router';
import CustomButton from '../../CustomButton';

// [JoinRoom Form]
// (field)
//   Room code
// (button)
//    Submit
//    Close

class JoinRoomForm extends Component {
    constructor(props) {
        super(props);
        this.initialValues = {
            roomCode: '',
        };

        this.state = {
            formValues: this.initialValues,
            errors: {},
        };
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;

        this.setState({
            formValues: {
                ...this.state.formValues,
                [name]: value,
            },
            errors: { ...this.state.errors },
        });
    };

    handleSubmit = (e, history) => {
        e.preventDefault();

        if (Object.keys(this.state.errors).length > 0) {
            return;
        }

        const payload = {
            // auth can go here
        };

        axios
            .post(`/api/${this.state.formValues.roomCode}/join`, payload)
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    const roomInfo = response.data;
                    const roomCode = roomInfo.room_code;
                    sessionStorage.clear();
                    sessionStorage.setItem('roomInfo', JSON.stringify(roomInfo));
                    sessionStorage.setItem('entryPoint', 'joinForm');
                    history.push(`/${roomCode}`);
                }
            })
            .catch((error) => {
                console.log(error);
            });
        this.props.handleClose();
    };

    render() {
        const { history } = this.props;

        return (
            <form
                onSubmit={(e) => {
                    this.handleSubmit(e, history);
                }}
            >
                <Grid container alignItems="center" justifyContent="center" direction="column">
                    <Grid container direction="row">
                        <Grid item>
                            <TextField
                                id="room-code-input"
                                name="roomCode"
                                label="Room code:"
                                type="string"
                                value={this.state.formValues.roomCode}
                                onChange={this.handleInputChange}
                                required
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="flex-end"
                        style={{ marginTop: 20 }}
                    >
                        <CustomButton
                            title="Submit"
                            onClick={(e) => {
                                this.handleSubmit(e, history);
                            }}
                        />
                        <CustomButton
                            title="Close"
                            onClick={(e) => {
                                this.props.handleClose();
                            }}
                        />
                    </Grid>
                </Grid>
            </form>
        );
    }
}

export default withRouter(JoinRoomForm);
