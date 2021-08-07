import React, { Component } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Box } from '@material-ui/core';

const styles = (theme) => ({
    paper: {
        margin: 'auto',
    },

    needsAmount: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 80,
            marginTop: 10,
        },
    },

    needsDescription: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 180,
            marginTop: 10,
        },
    },
});

class EditableNeedsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            surviveAmount: '',
            thriveAmount: '',
            needsDescription: '',
        };

        this.userId = sessionStorage.getItem('userId');
        this.roomCode = this.props.roomInfo.room_code;
        // this.roomCode = sessionStorage.getItem('roomInfo').room_code
        this._isMounted = false; //using isMounted react pattern to avoid memory leak https://stackoverflow.com/questions/52061476/cancel-all-subscriptions-and-asyncs-in-the-componentwillunmount-method-how
    }

    parseNeeds = (roomInfo, userId) => {
        const userData = roomInfo.people.filter((el) => {
            return el.person_id === parseInt(userId);
        })[0];
        return {
            surviveAmount: userData.needs_lower_bound_cents / 100,
            thriveAmount: userData.needs_upper_bound_cents / 100,
            needsDescription: userData.needs_description,
        };
    };

    componentDidMount = () => {
        const getNeedsFromBackend = async () => {
            const response = await axios.get(`/api/${this.roomCode}`);
            const responseData = await response.data;
            const { surviveAmount, thriveAmount, needsDescription } = this.parseNeeds(
                responseData,
                this.userId
            );
            this._isMounted &&
                this.setState({
                    surviveAmount: surviveAmount,
                    thriveAmount: thriveAmount,
                    needsDescription: needsDescription,
                });
        };

        this._isMounted = true;
        // Is verifying at least one is unset enough ?
        if (this.state.surviveAmount === '') {
            this._isMounted && getNeedsFromBackend();
        }
    };

    componentWillUnmount() {
        this._isMounted = false;
    }

    onChangeSurviveAmount = (newSurviveAmount, roomCode) => {
        if (this.state.thriveAmount && newSurviveAmount > this.state.thriveAmount) {
            this.setState({
                surviveAmount: newSurviveAmount,
                errors: { ...this.state.errors, surviveAmount: ':) > :D' },
            });
            return;
        }

        if (newSurviveAmount < 0) {
            this.setState({
                surviveAmount: newSurviveAmount,
                errors: { ...this.state.errors, surviveAmount: ':) < 0' },
            });
            return;
        }

        const errors = this.state.errors;
        delete errors.surviveAmount;

        // Delete error on thriveAmount field if change corrects issue
        if (errors.thriveAmount === ':D < :)') {
            delete errors.thriveAmount;
        }
        this.setState({
            surviveAmount: newSurviveAmount,
            errors: errors,
        });
    };

    onChangeThriveAmount = (newThriveAmount, roomCode) => {
        if (this.state.surviveAmount && newThriveAmount < this.state.surviveAmount) {
            this.setState({
                thriveAmount: newThriveAmount,
                errors: { ...this.state.errors, thriveAmount: ':D < :)' },
            });
            return;
        }

        if (newThriveAmount < 0) {
            this.setState({
                thriveAmount: newThriveAmount,
                errors: { ...this.state.errors, thriveAmount: ':D < 0' },
            });
            return;
        }

        const errors = this.state.errors;
        delete errors.thriveAmount;

        // Delete error on surviveAmount field if change corrects issue
        if (errors.surviveAmount === ':) > :D') {
            delete errors.surviveAmount;
        }

        this.setState({
            thriveAmount: newThriveAmount,
            errors: errors,
        });
    };

    onChangeNeedsDescription = (newNeedsDescription) => {
        this.setState({
            needsDescription: newNeedsDescription,
        });
    };

    onSubmit = (e) => {
        e.preventDefault();
        if (Object.keys(this.state.errors).length > 0) {
            return;
        }

        this.props.handleSubmit(
            this.state.surviveAmount,
            this.state.thriveAmount,
            this.state.needsDescription
        );
    };

    render() {
        const { classes } = this.props;
        return (
            <Box overflow="hidden">
                <form className={classes.paper} noValidate autoComplete="off">
                    <Box className={classes.needsAmount}>
                        <TextField
                            key={this.state._isMounted + 'survive'}
                            label=":)"
                            id="survive-amount-input"
                            value={this.state.surviveAmount}
                            onChange={(e) => {
                                this.onChangeSurviveAmount(parseInt(e.target.value), this.roomCode);
                            }}
                            size="small"
                            variant="outlined"
                            type="number"
                            error={!!this.state.errors.surviveAmount}
                            helperText={
                                this.state.errors.surviveAmount && this.state.errors.surviveAmount
                            }
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            key={this.state._isMounted + 'thrive'}
                            label=":D"
                            id="thrive-amount-input"
                            value={this.state.thriveAmount}
                            onChange={(e) => {
                                this.onChangeThriveAmount(parseInt(e.target.value), this.roomCode);
                            }}
                            size="small"
                            variant="outlined"
                            type="number"
                            error={!!this.state.errors.thriveAmount}
                            helperText={
                                this.state.errors.thriveAmount && this.state.errors.thriveAmount
                            }
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                    <Box className={classes.needsDescription}>
                        <TextField
                            key={this.state._isMounted + 'needsDescription'}
                            label="Needs description"
                            id="need-description-input"
                            value={this.state.needsDescription}
                            onChange={(e) => {
                                this.onChangeNeedsDescription(e.target.value, this.roomCode);
                            }}
                            size="small"
                            variant="outlined"
                            multiline={true}
                            maxRows={6}
                            type="string"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                    <br />
                    <div>
                        <button onClick={(e) => this.onSubmit(e)}>Submit</button>
                    </div>
                </form>
            </Box>
        );
    }
}

export default withStyles(styles)(EditableNeedsForm);
