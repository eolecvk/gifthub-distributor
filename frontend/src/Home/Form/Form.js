import React from 'react';
import JoinRoomForm from './JoinRoomForm';
import CreateRoomForm from './CreateRoomForm';
import './Form.css';

function Form(props) {
    if (props.formName === 'Create Room') {
        return <CreateRoomForm onSubmit={props.onSubmit} />;
    }
    return <JoinRoomForm onSubmit={props.onSubmit} />;
}

export default Form;
