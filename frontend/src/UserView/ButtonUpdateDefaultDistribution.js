import React from 'react';

function ButtonUpdateDefaultDistribution(props) {
    return (
        <div>
            <button onClick={(e) => props.updateDefaultDistribution('zero')}>Reset to 0</button>
            <button onClick={(e) => props.updateDefaultDistribution('equal')}>Equal amounts</button>
            <button onClick={(e) => props.updateDefaultDistribution('survive')}>
                Survive amounts
            </button>
            <button onClick={(e) => props.updateDefaultDistribution('thrive')}>
                Thrive amounts
            </button>
        </div>
    );
}

export default ButtonUpdateDefaultDistribution;
