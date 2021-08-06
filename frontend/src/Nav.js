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
                        <Link to="/participant-view">Participant View</Link>
                    </li>
                    <li>
                        <Link to="/observer-view">Observer View</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Nav;
