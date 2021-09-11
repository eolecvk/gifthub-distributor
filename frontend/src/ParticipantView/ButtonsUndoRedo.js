import React from 'react';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import CustomButton from '../CustomButton';
import './ButtonsUndoRedo.css';

function ButtonsUndoRedo(props) {
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
