import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {registerNeedsUpdate} from './utils'


// TODO
// * Do some form validation (survive < thrive!)
//     Convert to class component or use form...
//     https://codesandbox.io/s/material-demo-error-helper-text-w8b73?file=/demo.js:0-41
// * onComponentDidMount, GET userData from backend (instead of sessionStorage)

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
}));


function onChangeSurviveAmount(newSurviveAmount, roomCode) {
    const needsLowerBoundCents = newSurviveAmount * 100
    const args = { needsLowerBoundCents: needsLowerBoundCents }
    registerNeedsUpdate(args, roomCode)
}

function onChangeThriveAmount(newThriveAmount, roomCode) {
    const needsUpperBoundCents = newThriveAmount * 100
    const args = { needsUpperBoundCents: needsUpperBoundCents }
    registerNeedsUpdate(args, roomCode)
}

function onChangeNeedsDescription(newNeedsDescription, roomCode) {
    const args = { needsDescription: newNeedsDescription }
    registerNeedsUpdate(args, roomCode)
}

function EditableNeeds(props) {

    const { roomInfo } = props

    const roomCode = roomInfo.room_code
    const userId = sessionStorage.getItem('userId')
    const userData = roomInfo.people.filter((el) => { return (el.person_id === parseInt(userId)) })[0]
    const surviveAmount = userData.needs_lower_bound_cents / 100
    const thriveAmount = userData.needs_upper_bound_cents / 100
    const needsDescription = userData.needs_description

    const classes = useStyles();

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <div>
                <TextField
                    label=':)'
                    id="survive-amount-input"
                    defaultValue={surviveAmount}
                    onChange={(e) => { onChangeSurviveAmount(e.target.value, roomCode) }}
                    size="small"
                    variant="outlined"
                    type="Number"
                />
                <TextField
                    label=':D'
                    id="thrive-amount-input"
                    defaultValue={thriveAmount}
                    onChange={(e) => { onChangeThriveAmount(e.target.value, roomCode) }}
                    size="small"
                    variant="outlined"
                    type="Number"
                />
                <TextField
                    label='Needs description'
                    id="need-description-input"
                    defaultValue={needsDescription}
                    onChange={(e) => { onChangeNeedsDescription(e.target.value, roomCode) }}
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

export default EditableNeeds