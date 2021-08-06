import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';

function Header() {
    const style = {
        height: '50px',
        position: 'fixed',
        width: '100%',
        background: 'white',
        fontSize: 18,
        top: 0,
        boxShadow: '0px 10px 24px 0px rgba(0, 0, 0, 0.25)',
        opacity: 0.9,
    };

    return (
        <header style={style}>
            <Link to="/">
                <IconButton size="medium">
                    <HomeIcon fontSize="large" />
                </IconButton>
            </Link>
        </header>
    );
}

export default Header;
