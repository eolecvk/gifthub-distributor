import React, { Component } from 'react'
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { registerNeedsUpdate } from './utils'


// TODO
// * Do some form validation (survive < thrive!)
//     Convert to class component or use form...
//     https://codesandbox.io/s/material-demo-error-helper-text-w8b73?file=/demo.js:0-41
// * onComponentDidMount, GET userData from backend (instead of sessionStorage)


const styles = (theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
})


class EditableNeeds extends Component {

    constructor(props) {
        super(props)
        this.state = {
            errors: {},
            surviveAmount: undefined,
            thriveAmount: undefined,
            needsDescription: undefined
        }
        this.roomInfo = props.roomInfo
        this.roomCode = this.roomInfo.room_code
        this.userId = sessionStorage.getItem('userId')
        this._isMounted = false; //using isMounted react pattern to avoid memory leak https://stackoverflow.com/questions/52061476/cancel-all-subscriptions-and-asyncs-in-the-componentwillunmount-method-how
    }

    parseNeeds = (roomInfo, userId) => {
        const userData = roomInfo.people.filter((el) => { return (el.person_id === parseInt(userId)) })[0]
        return {
            surviveAmount: userData.needs_lower_bound_cents / 100,
            thriveAmount: userData.needs_upper_bound_cents / 100,
            needsDescription: userData.needs_description
        }
    }


    componentDidMount = () => {
        const getNeedsFromBackend = async () => {
            const response = await axios.get(`/api/${this.roomCode}`)
            const responseData = await response.data
            const { surviveAmount, thriveAmount, needsDescription } = this.parseNeeds(responseData, this.userId)
            this._isMounted && this.setState({
                surviveAmount: surviveAmount,
                thriveAmount: thriveAmount,
                needsDescription: needsDescription
            })
        }

        this._isMounted = true;
        // Is verifying at least one is unset enough ?
        if (typeof this.state.surviveAmount === 'undefined') {
            this._isMounted && getNeedsFromBackend()
        }
    }


    componentWillUnmount() {
        this._isMounted = false;
    }

    onChangeSurviveAmount = (newSurviveAmount, roomCode) => {

        if ((this.state.thriveAmount) && (newSurviveAmount > this.state.thriveAmount)) {
            this.setState({
                errors: { ...this.state.errors, surviveAmount: "please enter a survive amount that is inferior to the thrive amount" }
            });
            return
        }

        if (newSurviveAmount < 0) {
            this.setState({
                errors: { ...this.state.errors, surviveAmount: "please enter a positive survive amount" }
            });
            return
        }

        const errors = this.state.errors
        delete errors.surviveAmount
        this.setState({ errors: errors })

        const needsLowerBoundCents = newSurviveAmount * 100
        const args = { needsLowerBoundCents: needsLowerBoundCents }
        registerNeedsUpdate(args, roomCode)
    }

    onChangeThriveAmount = (newThriveAmount, roomCode) => {

        if (this.state.surviveAmount && newThriveAmount < this.state.surviveAmount) {
            this.setState({
                errors: { ...this.state.errors, thriveAmount: "please enter a thrive amount that is superior to the survive amount" }
            });
            return
        }

        if (newThriveAmount < 0) {
            this.setState({
                errors: { ...this.state.errors, thriveAmount: "please enter a positive thrive amount" }
            });
            return
        }

        const errors = this.state.errors
        delete errors.thriveAmount
        this.setState({ errors: errors })

        const needsUpperBoundCents = newThriveAmount * 100
        const args = { needsUpperBoundCents: needsUpperBoundCents }
        registerNeedsUpdate(args, roomCode)
    }

    onChangeNeedsDescription = (newNeedsDescription, roomCode) => {
        const args = { needsDescription: newNeedsDescription }
        registerNeedsUpdate(args, roomCode)
    }

    render() {
        const { classes } = this.props;
        return (
            <form className={classes.root} noValidate autoComplete="off">
                <div>
                    <TextField
                        key={this.state.surviveAmount}
                        label=':)'
                        id="survive-amount-input"
                        defaultValue={this.state.surviveAmount}
                        onChange={(e) => { this.onChangeSurviveAmount(e.target.value, this.roomCode) }}
                        size="small"
                        variant="outlined"
                        type="Number"
                        error={!!this.state.errors.surviveAmount}
                        helperText={this.state.errors.surviveAmount && this.state.errors.surviveAmount}
                    />
                    <TextField
                        key={this.state.thriveAmount}
                        label=':D'
                        id="thrive-amount-input"
                        defaultValue={this.state.thriveAmount}
                        onChange={(e) => { this.onChangeThriveAmount(e.target.value, this.roomCode) }}
                        size="small"
                        variant="outlined"
                        type="Number"
                        error={!!this.state.errors.thriveAmount}
                        helperText={this.state.errors.thriveAmount && this.state.errors.thriveAmount}
                    />
                    <TextField
                        key={this.state.needsDescription}
                        label='Needs description'
                        id="need-description-input"
                        defaultValue={this.state.needsDescription}
                        onChange={(e) => { registerNeedsUpdate({ needsDescription: e.target.value }, this.roomCode) }}
                        size="small"
                        variant="outlined"
                        multiline={true}
                        maxRows={6}
                        type="String"
                    />
                </div>
            </form>
        )
    }
}


export default withStyles(styles)(EditableNeeds)