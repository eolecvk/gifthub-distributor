import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import RedoIcon from '@material-ui/icons/Redo'
import UndoIcon from '@material-ui/icons/Undo';


//TODO:
// add disabled option to Undo button if first move
// add disabled option to Redo button if last move

function ButtonsUndoRedo(props) {

    const style = {
        "display": "flex",
        "justifyContent": "center",
        "alignItems": "center"
    }

    return (
        <div style={style}>
            <IconButton
                size='medium'
                onClick={() => props.undoMove()}>
                <UndoIcon fontSize="large" />
            </IconButton>
            <IconButton
                size='medium'
                onClick={() => props.redoMove()}>
                <RedoIcon fontSize="large" />
            </IconButton>
        </div>
    );
}

export default ButtonsUndoRedo