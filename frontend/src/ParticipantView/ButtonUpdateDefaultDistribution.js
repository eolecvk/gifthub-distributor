import React from 'react';
import './ButtonsUpdateDefaultDistribution.css';

function ButtonUpdateDefaultDistribution(props) {
    return (
        <div>
            <button id="reset-button" onClick={(e) => props.updateDefaultDistribution('zero')}>
                <span>0</span>
            </button>

            <button id="equal-button" onClick={(e) => props.updateDefaultDistribution('equal')}>
                <span>=</span>
            </button>

            <button id="survive-button" onClick={(e) => props.updateDefaultDistribution('survive')}>
                <span>:)</span>
            </button>

            <button id="thrive-button" onClick={(e) => props.updateDefaultDistribution('thrive')}>
                <span>:D</span>
            </button>
        </div>
    );
}

export default ButtonUpdateDefaultDistribution;
