import React from 'react'

function Footer() {

    const style = {
        position: 'fixed',
        height: '50px',
        backgroundColor: '#04AA6D',
        width: '100%',
        textAlign: 'center',
        lineHeight: '50px',
        left:0,
        bottom:0
    }

    return (
        <footer style={style}>GiftHub -- MIT License</footer>
    )
}

export default Footer