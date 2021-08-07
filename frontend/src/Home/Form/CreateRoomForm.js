import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { TextField, Grid, Button, ButtonGroup } from "@material-ui/core";


function CreateRoomForm(props) {

    const history = useHistory();
    const defaultValues = {
        roomName: "",
        splittingDollars: 0
    };

    const [formValues, setFormValues] = useState(defaultValues)

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
            room_name: formValues.roomName,
            splitting_cents: formValues.splittingDollars * 100,
        };

        //send request with axios
        axios
            .post('/api/rooms', payload)
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.setItem('roomInfo', JSON.stringify(response.data));
                    history.push('/observer');
                }
            })
            .catch((error) => {
                console.log(error);
            });
        props.handleClose()
    };

    return (

        <form onSubmit={handleSubmit}>
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                direction="row"
            >
                <Grid item xs={7} style={{ marginTop: 10 }}>
                    <TextField
                        id="room-name-input"
                        name="roomName"
                        label="Room name:"
                        type="text"
                        value={formValues.roomName}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={3} style={{ marginTop: 10 }}>
                    <TextField
                        id="amount-input"
                        name="splittingDollars"
                        label="Amount ($):"
                        type="number"
                        value={formValues.splittingDollars}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid
                container
                justifyContent="flex-end"
                style={{ marginTop: 25 }}>
                    <ButtonGroup>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit">
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            type="button"
                            onClick={(e) => { props.handleClose() }}
                        >
                            Close
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </form >
    )
}

export default CreateRoomForm;
