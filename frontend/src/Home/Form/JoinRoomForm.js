import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { TextField, Grid, Button, FormControlLabel, Switch } from '@material-ui/core';

function JoinRoomForm(props) {
    const history = useHistory();
    const defaultValues = {
        name: '',
        roomCode: '',
        isObserver: false,
        needsDescription: '',
        needsLowerBoundDollars: 0,
        needsUpperBoundDollars: 0,
    };
    const [formValues, setFormValues] = useState(defaultValues);
    //const [errors, setErrors] = useState({})

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        setFormValues({
            ...formValues,
            [name]: checked,
        });
    };

    const handleSubmit = (e) => {
        //e.preventDefault();

        const payload = {
            participant: !formValues.isObserver,
            name: formValues.name,
            needs_description: formValues.needsDescription,
            needs_lower_bound_cents: formValues.needsLowerBoundDollars * 100,
            needs_upper_bound_cents: formValues.needsUpperBoundDollars * 100,
        };

        axios
            .post(`/api/${formValues.roomCode}/join`, payload)
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.clear();
                    sessionStorage.setItem('roomInfo', JSON.stringify(response.data.room_info));
                    sessionStorage.setItem('userId', JSON.stringify(response.data.user_id));
                    history.push(formValues.isObserver ? '/observer' : '/participant');
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response.data.error === 'That room does not exist') {
                    alert('That room does not exist');
                }
            });
        props.handleClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container alignItems="center" justifyContent="center" direction="column">
                <Grid container direction="row">
                    <Grid item>
                        <TextField
                            id="room-code-input"
                            name="roomCode"
                            label="Room code:"
                            type="text"
                            value={formValues.roomCode}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs style={{ marginTop: 10 }}>
                        <FormControlLabel
                            label="Observer mode"
                            control={
                                <Switch
                                    name="isObserver"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                    checked={formValues.isObserver}
                                    onChange={handleSwitchChange}
                                />
                            }
                        />
                    </Grid>
                </Grid>

                <Grid
                    container
                    style={{
                        padding: 10,
                        display: formValues.isObserver ? 'none' : 'block',
                    }}
                >
                    <Grid>
                        <TextField
                            id="name"
                            name="name"
                            label="Name:"
                            type="text"
                            value={formValues.name}
                            onChange={handleInputChange}
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
                                value={formValues.needsLowerBoundDollars}
                                onChange={handleInputChange}
                                required
                                inputProps={{
                                    min: 0,
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                id="need-max-input"
                                name="needsUpperBoundDollars"
                                label="Thrive ($):"
                                type="number"
                                value={formValues.needsUpperBoundDollars}
                                onChange={handleInputChange}
                                required
                                inputProps={{
                                    min: formValues.needsLowerBoundDollars,
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid item style={{ marginTop: 10 }}>
                        <TextField
                            id="need-description-input"
                            name="needsDescription"
                            label="Need description:"
                            type="text"
                            value={formValues.needsDescription}
                            onChange={handleInputChange}
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
                            props.handleClose();
                        }}
                    >
                        Close
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default JoinRoomForm;
