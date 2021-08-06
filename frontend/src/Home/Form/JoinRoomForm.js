import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './Form.css';

function JoinRoomForm(props) {
    const history = useHistory();
    const close = () => props.onSubmit();
    const [roomCode, setRoomCode] = useState('');
    const [isObserver, setIsObserver] = useState(false)
    const [name, setName] = useState('');
    const [needsLowerBoundCents, setNeedsLowerBoundCents] = useState(0);
    const [needsUpperBoundCents, setNeedsUpperBoundCents] = useState(0);
    const [needsDescription, setNeedsDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        let payload
        if (isObserver) {
            payload = {
                participant: false
            }
        } else {
            payload = {
                name: name,
                needs_description: needsDescription,
                needs_lower_bound_cents: needsLowerBoundCents * 100,
                needs_upper_bound_cents: needsUpperBoundCents * 100,
                participant: true
            }
        }

        axios
            .get(`/api/${roomCode}`)
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.clear();
                    sessionStorage.setItem("roomInfo", JSON.stringify(response.data))

                    if (isObserver) {
                        history.push('/observer-view');
                    } else {
                        sessionStorage.setItem("userId", JSON.stringify(response.data.user_id))
                        history.push('/participant-view');
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            })
        close();

    }

    return (
        <form
            onSubmit={(e) => {
                handleSubmit(e);
            }}
        >
            <div>
                <label htmlFor="room-code">Room code:</label>
                <input
                    id="room-code"
                    name="room-code"
                    type="text"
                    required
                    value={roomCode}
                    onChange={(e) => { setRoomCode(e.target.value); }}
                />
            </div>

            <input
                type="checkbox"
                id="observe-only"
                name="observe-only"
                value="observe"
                onClick={(e) => { setIsObserver(e.target.checked) }}
            />
            <label htmlFor="observe-only">Observe only</label>

            <div style={{ display: isObserver ? 'none' : 'inline' }}>
                <div>
                    <label htmlFor='username'>Username:</label>
                    <input
                        id='username'
                        name='username'
                        type="text"
                        required={isObserver ? false : true}
                        value={name}
                        onChange={(e) => { setName(e.target.value); }}
                    />
                </div>

                <div>
                    <label htmlFor='need-min'>Need min ($):</label>
                    <input
                        id='need-min'
                        name='need-min'
                        type="number"
                        required={isObserver ? false : true}
                        min="0"
                        value={needsLowerBoundCents}
                        onChange={(e) => {
                            setNeedsLowerBoundCents(e.target.value);
                        }}
                    />
                </div>

                <div>
                    <label htmlFor='need-max'>Need max ($):</label>
                    <input
                        id='need-max'
                        name='need-max'
                        type="number"
                        required={isObserver ? false : true}
                        min={needsLowerBoundCents}
                        value={needsUpperBoundCents}
                        onChange={(e) => {
                            setNeedsUpperBoundCents(e.target.value);
                        }}
                    />
                </div>


                <div>
                    <label htmlFor='need-description'>Need description:</label>
                    <textarea
                        id='need-description'
                        name='need-description'
                        rows='4'
                        cols='50'
                        value={needsDescription}
                        onChange={(e) => {
                            setNeedsDescription(e.target.value);
                        }}
                    />
                </div>
            </div>

            <button
                type="submit"
                name="Submit">
                Submit
            </button>
        </form>
    );
}

export default JoinRoomForm;
