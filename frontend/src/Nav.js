import React from 'react';
import {
    Link, 
    withRouter
} from 'react-router-dom';

function Nav(props) {
    return(
        <div>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/input-page">Input Page</Link></li>
                    <li><Link to="/admin-view">Admin View</Link></li>
                    </ul>
                </nav>
        </div>
    )
}
export default Nav;