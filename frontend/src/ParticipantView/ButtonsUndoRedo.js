import React from 'react';
import { Tooltip } from '@material-ui/core';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import './ButtonsUndoRedo.css';
import CustomButton from '../CustomButton';

//TODO:
// add disabled option to Undo button if first move
// add disabled option to Redo button if last move

function ButtonsUndoRedo(props) {
    const undoRedoButtonsLegacy = (
        <div>
            <Tooltip title="Undo move">
                <button id="undo-button" onClick={() => props.undoMove()}>
                    <svg
                        version="1.1"
                        id="undo-icon"
                        x="0px"
                        y="0px"
                        viewBox="0 0 26.676 26.676"
                        style={{ enableBackground: 'new 0 0 26.676 26.676' }}
                    >
                        <path
                            d="M26.105,21.891c-0.229,0-0.439-0.131-0.529-0.346l0,0c-0.066-0.156-1.716-3.857-7.885-4.59
    c-1.285-0.156-2.824-0.236-4.693-0.25v4.613c0,0.213-0.115,0.406-0.304,0.508c-0.188,0.098-0.413,0.084-0.588-0.033L0.254,13.815
    C0.094,13.708,0,13.528,0,13.339c0-0.191,0.094-0.365,0.254-0.477l11.857-7.979c0.175-0.121,0.398-0.129,0.588-0.029
    c0.19,0.102,0.303,0.295,0.303,0.502v4.293c2.578,0.336,13.674,2.33,13.674,11.674c0,0.271-0.191,0.508-0.459,0.562
    C26.18,21.891,26.141,21.891,26.105,21.891z"
                        />
                    </svg>
                </button>
            </Tooltip>

            <Tooltip title="Redo move">
                <button id="redo-button" onClick={() => props.redoMove()}>
                    <svg
                        version="1.1"
                        id="redo-icon"
                        x="0px"
                        y="0px"
                        viewBox="0 0 20.697 20.697"
                        style={{ enableBackground: 'new 0 0 20.697 20.697' }}
                    >
                        <path
                            style={{ fill: '#030104' }}
                            d="M0.358,16.978C0.148,16.934,0,16.752,0,16.542c0-7.253,8.61-8.798,10.61-9.059V4.155
            c0-0.164,0.09-0.314,0.235-0.393c0.147-0.076,0.321-0.065,0.456,0.024l9.202,6.194c0.121,0.082,0.194,0.218,0.194,0.369
            c0,0.147-0.073,0.284-0.194,0.366l-9.197,6.193c-0.137,0.09-0.313,0.1-0.457,0.023c-0.146-0.078-0.236-0.229-0.236-0.394v-3.58
            c-1.447,0.009-2.645,0.073-3.642,0.193c-4.785,0.567-6.064,3.44-6.116,3.563l0,0c-0.071,0.165-0.233,0.271-0.41,0.271
            C0.415,16.986,0.385,16.984,0.358,16.978z"
                        />
                    </svg>
                </button>
            </Tooltip>
        </div>
    );

    const undoRedoButtons = (
        <div>
            <CustomButton
                style={{ width: 40 + 'px' }}
                startIcon={<UndoIcon />}
                onClick={() => props.undoMove()}
                tooltip="Undo move"
            />
            <CustomButton
                endIcon={<RedoIcon />}
                onClick={() => props.redoMove()}
                tooltip="Redo move"
            />
        </div>
    );

    return undoRedoButtons;
}

export default ButtonsUndoRedo;
