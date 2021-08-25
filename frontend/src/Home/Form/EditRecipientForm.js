import React, { Component } from 'react';
import axios from 'axios';
import { TextField, Grid, Button } from '@material-ui/core';

// [EditRecipient Form]
// (fields)
//   Name
//   Survive amount 
//   Thrive amount
//   Need description
// (buttons)
//   Submit
//   Remove *with confirmation dialog


class EditRecipientForm extends Component {
    constructor(props) {
        super(props);
        this.initialValues = {
            name: '',
            needsLowerBoundDollars: '',
            needsUpperBoundDollars: '',
            needsDescription: ''
        };

        this.state = {
            formValues: this.initialValues,
            errors: {},
        };

        this.recipientId = this.props.recipientId
    }

    onChangeSurviveAmount = (e) => {
        let { name, value } = e.target;

        if (value !== '') {
            value = parseInt(value);

            if (
                this.state.formValues.needsUpperBoundDollars &&
                value > this.state.formValues.needsUpperBoundDollars
            ) {
                this.setState({
                    formValues: {
                        ...this.state.formValues,
                        [name]: value,
                    },
                    errors: {
                        ...this.state.errors,
                        [name]: ':) > :D',
                    },
                });
                return;
            }

            if (value < 0) {
                this.setState({
                    formValues: {
                        ...this.state.formValues,
                        [name]: value,
                    },
                    errors: {
                        ...this.state.errors,
                        [name]: ':) < 0',
                    },
                });
                return;
            }
        }

        const errors = this.state.errors;
        delete errors.needsLowerBoundDollars;

        // Delete error on thriveAmount field if change corrects issue
        if (errors.needsUpperBoundDollars === ':D < :)') {
            delete errors.needsUpperBoundDollars;
        }
        this.setState({
            formValues: {
                ...this.state.formValues,
                [name]: value,
            },
            errors: {
                ...errors,
            },
        });
    };

    onChangeThriveAmount = (e) => {
        let { name, value } = e.target;

        if (value !== '') {
            value = parseInt(value);

            if (
                this.state.formValues.needsLowerBoundDollars &&
                value < this.state.formValues.needsLowerBoundDollars
            ) {
                this.setState({
                    formValues: {
                        ...this.state.formValues,
                        [name]: value,
                    },
                    errors: {
                        ...this.state.errors,
                        [name]: ':D < :)',
                    },
                });
                return;
            }

            if (value < 0) {
                this.setState({
                    formValues: {
                        ...this.state.formValues,
                        [name]: value,
                    },
                    errors: {
                        ...this.state.errors,
                        [name]: ':D < 0',
                    },
                });
                return;
            }
        }

        const errors = this.state.errors;
        delete errors.needsUpperBoundDollars;

        // Delete error on thriveAmount field if change corrects issue
        if (errors.needsLowerBoundDollars === ':) > :D') {
            delete errors.needsLowerBoundDollars;
        }
        this.setState({
            formValues: {
                ...this.state.formValues,
                [name]: value,
            },
            errors: {
                ...errors,
            },
        });
    };

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


    handleSubmit = (e) => {
        e.preventDefault();

        if (Object.keys(this.state.errors).length > 0) {
            return;
        }

        const payload = {
            events: [
                {
                    kind: "RECIPIENT_ADD",
                    name: this.state.formValues.name,
                    needs_description: this.state.formValues.needsDescription,
                    needs_lower_bound_cents: this.state.formValues.needsLowerBoundDollars * 100,
                    needs_upper_bound_cents: this.state.formValues.needsUpperBoundDollars * 100,
                }
            ]
        };

        axios
            .put(`/api/${this.state.formValues.roomCode} `, payload)
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.clear();
                    sessionStorage.setItem('roomInfo', JSON.stringify(response.data.room_info));
                }
            })
        // ERROR HANDLING SPECIFIC TO ADDING A RECIPIENT
        // .catch((error) => {
        //     console.log(error);
        //     if (error.response.data.error === 'SOME ERROR MESSAGE') {
        //         // HANDLE ERROR IN SOME WAY
        //     }
        // });
        this.props.handleClose();
    };

    handleRemove = (e) => {
        e.preventDefault();

        const recipientId = this.props.recipientId

        const payload = {
            events: [
                {
                    kind: "RECIPIENT_REMOVE",
                    recipient_id: recipientId
                }
            ]
        };

        axios
            .put(`/api/${this.state.formValues.roomCode} `, payload)
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.clear();
                    sessionStorage.setItem('roomInfo', JSON.stringify(response.data.room_info));
                }
            })
            // ERROR HANDLING SPECIFIC TO REMOVING A RECIPIENT
            // .catch((error) => {
            //     console.log(error);
            //     if (error.response.data.error === 'SOME ERROR MESSAGE') {
            //         // HANDLE ERROR IN SOME WAY
            //     }
            // });

        this.props.handleClose();
    }

    render() {

        return (
            <form
                onSubmit={(e) => {
                    this.handleSubmit(e);
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
                            justifyContent="space-around"
                            direction="row"
                            style={{ marginTop: 10 }}
                        >
                            <Grid item xs={4}>
                                <TextField
                                    id="need-min-input"
                                    name="needsLowerBoundDollars"
                                    label="Survive ($):"
                                    type="number"
                                    value={this.state.formValues.needsLowerBoundDollars}
                                    onChange={this.onChangeSurviveAmount}
                                    required
                                    error={!!this.state.errors.needsLowerBoundDollars}
                                    helperText={
                                        this.state.errors.needsLowerBoundDollars &&
                                        this.state.errors.needsLowerBoundDollars
                                    }
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="need-max-input"
                                    name="needsUpperBoundDollars"
                                    label="Thrive ($):"
                                    type="number"
                                    value={this.state.formValues.needsUpperBoundDollars}
                                    onChange={this.onChangeThriveAmount}
                                    required
                                    error={!!this.state.errors.needsUpperBoundDollars}
                                    helperText={
                                        this.state.errors.needsUpperBoundDollars &&
                                        this.state.errors.needsUpperBoundDollars
                                    }
                                />
                            </Grid>
                        </Grid>
                        <Grid item style={{ marginTop: 10 }}>
                            <TextField
                                id="need-description-input"
                                name="needsDescription"
                                label="Need description:"
                                type="string"
                                value={this.state.formValues.needsDescription}
                                onChange={this.handleInputChange}
                                multiline
                                rows={4}
                                variant="filled"
                                fullWidth={true}
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
                                this.handleRemove(e);
                            }}
                        >
                            Remove
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

export default EditRecipientForm;
