import React, { Component } from 'react';
import axios from 'axios';
import { TextField, Grid, ButtonGroup } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import PublishIcon from '@material-ui/icons/Publish';
import CustomButton from '../CustomButton';

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
            formValues: {
                name: '',
                needsLowerBoundDollars: '',
                needsUpperBoundDollars: '',
                needsDescription: '',
            },
            errors: {},
        };

        this.state = this.initialValues;
        this.roomCode = this.props.roomInfo.room_code;
        this.recipientId = this.props.recipientId;
        this._isMounted = false; //using isMounted react pattern to avoid memory leak https://stackoverflow.com/questions/52061476/cancel-all-subscriptions-and-asyncs-in-the-componentwillunmount-method-how
    }

    parseInfo = (roomInfo, recipientId) => {
        const recipientData = roomInfo.recipients.filter((el) => {
            return el.recipient_id === parseInt(recipientId);
        })[0];
        return {
            name: recipientData.name,
            needsLowerBoundDollars: recipientData.needs_lower_bound_cents / 100,
            needsUpperBoundDollars: recipientData.needs_upper_bound_cents / 100,
            needsDescription: recipientData.needs_description,
        };
    };

    componentDidMount = () => {
        const getNeedsFromBackend = async () => {
            const response = await axios.get(`/api/${this.roomCode}`);
            const responseData = await response.data;

            const {
                name,
                needsLowerBoundDollars,
                needsUpperBoundDollars,
                needsDescription,
            } = this.parseInfo(responseData, this.recipientId);

            const formValues = {
                name: name,
                needsLowerBoundDollars: needsLowerBoundDollars,
                needsUpperBoundDollars: needsUpperBoundDollars,
                needsDescription: needsDescription,
            };

            this._isMounted &&
                this.setState({
                    formValues: formValues,
                    errors: {},
                });
        };

        this._isMounted = true;
        // Is verifying at least one is unset enough ?
        if (this.state.formValues.needsLowerBoundDollars === '') {
            this._isMounted && getNeedsFromBackend();
        }
    };

    componentWillUnmount() {
        this._isMounted = false;
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
                    kind: 'RECIPIENT_UPDATE',
                    recipient_id: this.recipientId,
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
                    sessionStorage.clear();
                    sessionStorage.setItem('roomInfo', JSON.stringify(response.data));
                }
            })
            .catch((error) => {
                console.log(error);
            });
        this.props.handleCloseEditRecipientModal();
    };

    handleRemove = (e) => {
        e.preventDefault();

        const confirmRes = window.confirm('Are you sure you want to remove the recipient?');
        if (confirmRes === false) {
            return;
        }

        const payload = {
            events: [
                {
                    kind: 'RECIPIENT_REMOVE',
                    recipient_id: this.recipientId,
                },
            ],
        };

        axios
            .put(`/api/${this.roomCode} `, payload)
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.clear();
                    sessionStorage.setItem('roomInfo', JSON.stringify(response.data));
                    if (response.data.recipients.length === 0) {
                        sessionStorage.setItem('view', 'list');
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });

        this.props.handleCloseEditRecipientModal();

        try {
            this.props.handleCloseRecipientModal();
        } catch {}
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
                        <ButtonGroup orientation="vertical">
                            <CustomButton
                                key="submit-button"
                                title="Submit"
                                startIcon={<PublishIcon />}
                                color="red"
                                onClick={(e) => {
                                    this.handleSubmit(e);
                                }}
                            />
                            <CustomButton
                                key="remove-button"
                                title="Remove"
                                startIcon={<HighlightOffIcon />}
                                color="green"
                                onClick={(e) => {
                                    this.handleRemove(e);
                                }}
                            />
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </form>
        );
    }
}

export default EditRecipientForm;
