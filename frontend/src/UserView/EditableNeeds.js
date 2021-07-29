import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {registerNeedsUpdate} from './utils'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
}));


function onChangeSurviveAmount(roomCode, newSurviveAmount) {
    const needsLowerBoundCents = newSurviveAmount * 100
    const args = { needsLowerBoundCents: needsLowerBoundCents }
    registerNeedsUpdate(args, roomCode)
}

function onChangeThriveAmount(roomCode, newThriveAmount) {
    const needsUpperBoundCents = newThriveAmount * 100
    const args = { needsUpperBoundCents: needsUpperBoundCents }
    registerNeedsUpdate(args, roomCode)
}

function onChangeNeedsDescription(roomCode, newNeedsDescription) {
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
                    onChange={(e) => { onChangeSurviveAmount(roomCode, e.target.value) }}
                    size="small"
                    variant="outlined"
                />
                <TextField
                    label=':D'
                    id="thrive-amount-input"
                    defaultValue={thriveAmount}
                    onChange={(e) => { onChangeThriveAmount(roomCode, e.target.value) }}
                    size="small"
                    variant="outlined"
                />
                <TextField
                    label='Needs description'
                    id="need-description-input"
                    defaultValue={needsDescription}
                    onChange={(e) => { onChangeNeedsDescription(roomCode, e.target.value) }}
                    size="small"
                    variant="outlined"
                />
            </div>
        </form>
    )

}

export default EditableNeeds