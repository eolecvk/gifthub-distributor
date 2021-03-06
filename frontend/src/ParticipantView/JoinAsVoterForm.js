import React, { Component } from 'react';
import axios from 'axios';
import { TextField, Grid } from '@material-ui/core';
import { withRouter } from 'react-router';
import CustomButton from '../CustomButton';

// [JoinAsVoter Form]
// (fields)
//   Name

// (buttons)
//   Submit

class JoinAsVoterForm extends Component {
    constructor(props) {
        super(props);
        this.initialValues = {
            name: '',
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
            name: this.state.formValues.name,
        };

        axios
            .post(`/api/${this.props.roomCode}/voterJoin`, payload)
            .then((response) => {
                if (response.status === 200) {
                    const path = response.data.path;
                    const voterId = response.data.voter_id;
                    const roomInfo = response.data.room_info;
                    const roomCode = roomInfo.room_code;

                    sessionStorage.clear();
                    sessionStorage.setItem('path', path);
                    sessionStorage.setItem('voterId', voterId);
                    sessionStorage.setItem('roomInfo', JSON.stringify(roomInfo));
                    history.push(`/${roomCode}/${path}`);
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
                    <Grid container style={{ padding: 10 }}>
                        <Grid>
                            <TextField
                                id="name"
                                name="name"
                                label="Name:"
                                type="string"
                                value={this.state.formValues.name}
                                onChange={this.handleInputChange}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
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
                </Grid>
            </form>
        );
    }
}

export default withRouter(JoinAsVoterForm);
