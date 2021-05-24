import React, { Component } from 'react'
import {CreateRoomForm, JoinRoomForm} from "./Forms"


function Home() {
    return (
        // <h1>Welcome to the Money Pot</h1>
        <div>
            <CreateRoomForm></CreateRoomForm>
            <JoinRoomForm></JoinRoomForm>
        </div>
    )
}
export default Home;
