import React from 'react';
import PopupGroup from './PopupGroup/PopupGroup';

import './Home.css';

function Home() {
    return (
        <div className="home">
            <div className="btn-group">
                <PopupGroup buttonTitle="Create Room" />
                <PopupGroup buttonTitle="Join Room" />
            </div>
        </div>
    );
}

export default Home;
