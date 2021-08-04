import React from 'react';
import PopupGroup from './PopupGroup/PopupGroup';
import { Component } from 'react';

import './Home.css';

class Home extends Component {
    componentDidMount() {
        document.title = 'GiftHub Distributor';
    }
    
    render(){
        return (
            <div className="home">
                <div className="btn-group">
                    <PopupGroup buttonTitle="Create Room" />
                    <PopupGroup buttonTitle="Join Room" />
                </div>
            </div>
        );
    }
}

export default Home;
