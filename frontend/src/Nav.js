import React from 'react';
import { Link } from 'react-router-dom';

function Nav() {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/input-page">Input Page</Link>
                    </li>
                    <li>
                        <Link to="/admin-view">Admin View</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Nav;
