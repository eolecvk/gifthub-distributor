import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './Form.css';

function CreateRoomForm(props) {
    const history = useHistory();
    const close = () => props.onSubmit();
    const [roomName, setRoomName] = useState('');
    const [splittingCents, setSplittingCents] = useState(0);
    const [cookies, setCookie] = useCookies(['roomInfo']);

    function saveRoomInfo(roomInfo) {
        setCookie('roomInfo', roomInfo, { path: '/' });
    }

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
                    //save response as app context or cookie or something
                    saveRoomInfo(response.data);
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
            <label>
                {' '}
                Room name:
                <input
                    type="text"
                    required
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
            </label>
            <label>
                {' '}
                Amount ($):
                <input
                    type="number"
                    required
                    min="1"
                    value={splittingCents}
                    onChange={(e) => setSplittingCents(e.target.value)}
                />
            </label>
            <button type="submit" name="Submit">
                Submit
            </button>
        </form>
    );
}

export default CreateRoomForm;
