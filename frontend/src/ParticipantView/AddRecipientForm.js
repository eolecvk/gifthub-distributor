import React, { Component } from 'react';
import axios from 'axios';
import { TextField, Grid } from '@material-ui/core';
import CustomButton from '../CustomButton';

// [AddRecipient Form]
// (fields)
//   Name
//   Survive amount
//   Thrive amount
//   Need description
// (buttons)
//   Submit

class AddRecipientForm extends Component {
    constructor(props) {
        super(props);
        this.initialValues = {
            name: '',
            needsLowerBoundDollars: '',
            needsUpperBoundDollars: '',
            needsDescription: '',
        };

        this.state = {
            formValues: this.initialValues,
            errors: {},
        };

        this.roomCode = this.props.roomCode;
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
                    kind: 'RECIPIENT_ADD',
                    name: this.state.formValues.name,
                    needs_description: this.state.formValues.needsDescription,
                    needs_lower_bound_cents: this.state.formValues.needsLowerBoundDollars * 100,
                    needs_upper_bound_cents: this.state.formValues.needsUpperBoundDollars * 100,
                },
            ],
        };

        axios
            .put(`/api/${this.roomCode} `, payload)
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.setItem('roomInfo', JSON.stringify(response.data));
                }
            })
            .catch((error) => {
                console.log(error);
            });
        this.props.handleClose();
    };

    render() {
        return (
            <form
                onSubmit={(e) => {
                    this.handleSubmit(e);
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
                                    InputLabelProps={{ shrink: true }}
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
                                    InputLabelProps={{ shrink: true }}
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
                                InputLabelProps={{ shrink: true }}
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
                                this.handleSubmit(e);
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

export default AddRecipientForm;
