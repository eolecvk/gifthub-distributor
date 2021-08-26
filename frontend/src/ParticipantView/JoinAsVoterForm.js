import React, { Component } from 'react';
import axios from 'axios';
import { TextField, Grid, Button } from '@material-ui/core';
import { withRouter } from 'react-router';

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
            name: this.state.formValues.name
        };

        axios
            .post(`/api/${this.props.roomCode}/voterJoin`, payload)
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.clear();
                    sessionStorage.setItem('roomInfo', JSON.stringify(response.data.room_info));
                    const path = response.data.path
                    history.push(`/${this.props.roomCode}/${path}`)
                }
            })
            .catch((error) => {
                alert(error.response.data.error)
                // if (error.response.data.error === 'SOME ERROR MESSAGE') {
                //     // HANDLE ERROR IN SOME WAY
                // }
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
                    <Grid
                        container
                        style={{ padding: 10 }}
                    >
                        <Grid>
                            <TextField
                                id="name"
                                name="name"
                                label="Name:"
                                type="string"
                                value={this.state.formValues.name}
                                onChange={this.handleInputChange}
                                required
                            />
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
                </Grid>
            </form>
        );
    }
}

export default withRouter(JoinAsVoterForm);
