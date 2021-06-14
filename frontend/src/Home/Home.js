import React from "react"
import PopupGroup from './PopupGroup/PopupGroup'

import './Home.css'

function Home() {

    return (
        <div className='home'>
            <h1 className='main-title'>GiftHub</h1>
            <div className="btn-group">
                <PopupGroup buttonTitle='Create Room' />
                <PopupGroup buttonTitle='Join Room' />
            </div>
        </div>
    )
}

export default Home;