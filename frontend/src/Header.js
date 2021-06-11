import React from "react";
import { Link } from "react-router-dom"

function Header() {

    const style = {
        height: '100px',
        position: 'fixed',
        width: '100%',
        background: 'white',
        fontSize: 18,
        top: 0,
        boxShadow: '0px 10px 24px 0px rgba(0, 0, 0, 0.25)',
        opacity: .90
    }

    return (
        <header style={style}>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/input-page">Input Page</Link></li>
                    <li><Link to="/admin-view">Admin View</Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;