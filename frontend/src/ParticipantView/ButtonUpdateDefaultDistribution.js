import React from 'react';
import './ButtonsUpdateDefaultDistribution.css';

function ButtonUpdateDefaultDistribution(props) {

    const showDistributionModals = () => {
        console.log('hello')
    }

    return (

        <div>
            <button id="quick-distributions-button" onClick={() => showDistributionModals()}>
                <svg
                    version="1.1"
                    id="quick-distributions-icon"
                    x="0px"
                    y="0px"
                    viewBox="0 0 26.676 26.676"
                    style={{ enableBackground: 'new 0 0 26.676 26.676' }}
                >
                    <path
                        d="M12 2.02c-5.51 0-9.98 4.47-9.98 9.98s4.47 9.98 9.98 9.98 9.98-4.47 9.98-9.98S17.51 2.02 12 2.02zM11.48 20v-6.26H8L13 4v6.26h3.35L11.48 20z">
                    </path>
                </svg>
            </button>

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
        </div>
    );
}

export default ButtonUpdateDefaultDistribution;
