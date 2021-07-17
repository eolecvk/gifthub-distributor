import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './Form.css';

function CreateRoomForm(props) {
    const history = useHistory();
    const close = () => props.onSubmit();
    const [roomName, setRoomName] = useState('');
    const [splittingCents, setSplittingCents] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();

        //form payload
        const payload = {
            room_name: roomName,
            splitting_cents: splittingCents * 100,
        };

        //send request with axios
        axios
            .post('/api/rooms', payload)
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.setItem("roomInfo", JSON.stringify(response.data))
                    history.push('/admin-view');
                }
            })
            .catch((error) => {
                console.log(error);
            });
        close();
    };

    return (
        <form
            onSubmit={(e) => {
                handleSubmit(e);
            }}
        >
            <div>
                <label>Room name:</label>
                <input
                    type="text"
                    required
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
            </div>

            <div>
                <label>Amount ($):</label>
                <input
                    type="number"
                    required
                    min="1"
                    value={splittingCents}
                    onChange={(e) => setSplittingCents(e.target.value)}
                />
            </div>

            <button type="submit" name="Submit">
                Submit
            </button>
        </form >
    );
}

export default CreateRoomForm;
