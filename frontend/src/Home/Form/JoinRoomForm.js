import React, { Component } from 'react';
import axios from 'axios';
import { TextField, Grid, Button } from '@material-ui/core';
import { withRouter } from 'react-router';

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
                if (response.status === 200) {
                    sessionStorage.clear();
                    sessionStorage.setItem('roomInfo', JSON.stringify(response.data.room_info));
                    history.push(`/#/${this.state.formValues.roomCode}/join`);
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response.data.error === 'That room does not exist') {
                    alert('That room does not exist');
                }
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
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            type="button"
                            onClick={(e) => {
                                this.props.handleClose();
                            }}
                        >
                            Close
                        </Button>
                    </Grid>
                </Grid>
            </form>
        );
    }
}

export default withRouter(JoinRoomForm);
