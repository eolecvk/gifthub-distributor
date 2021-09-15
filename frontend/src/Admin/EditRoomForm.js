import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Grid, ButtonGroup } from '@material-ui/core';
import CustomButton from '../CustomButton';

// [CreateRoom form]
// (fields)
//   Room name
//   Amount Distributed ($)
// (buttons)
//   Submit
//   Close

function EditRoomForm(props) {
    const defaultValues = {
        roomName: '',
        splittingDollars: '',
    };

    const [formValues, setFormValues] = useState(defaultValues);

    const {roomCode} = props

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        //form payload
        const payload = {
            kind: 'ROOM_UPDATE',
            room_name: formValues.roomName,
            splitting_cents: formValues.splittingDollars * 100,
        };

        //send request with axios
        axios
            .put(`/api/${roomCode}`, payload)
            .then((response) => {
                if (response.status === 200) {
                    const roomInfo = response.data;
                    sessionStorage.setItem('roomInfo', JSON.stringify(roomInfo));
                }
            })
            .catch((error) => {
                console.log(error);
            });
        props.handleClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid
                container
                alignItems="center"
                justifyContent="space-around"
                direction="row"
                style={{ marginTop: 10 }}
            >
                <Grid item xs={7}>
                    <TextField
                        id="room-name-input"
                        name="roomName"
                        label="Room name:"
                        type="text"
                        value={formValues.roomName}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs>
                    <TextField
                        id="amount-input"
                        name="splittingDollars"
                        label="Amount ($)"
                        type="number"
                        value={formValues.splittingDollars}
                        onChange={handleInputChange}
                        inputProps={{ min: 0 }}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid container justifyContent="flex-end" style={{ marginTop: 25 }}>
                    <ButtonGroup>
                        <CustomButton title="Submit" onClick={handleSubmit} />
                        <CustomButton
                            title="Close"
                            onClick={(e) => {
                                props.handleClose();
                            }}
                        />
                    </ButtonGroup>
                </Grid>
            </Grid>
        </form>
    );
}

export default EditRoomForm;
