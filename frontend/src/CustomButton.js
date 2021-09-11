import React from 'react';
import { IconButton, Button, Tooltip } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { green, red, grey } from '@material-ui/core/colors';

function CustomButton(props) {
    const { title, onClick, size, tooltip, startIcon, endIcon, color, style } = props;

    const buttonThemeGrey = createTheme({
        palette: {
            primary: grey,
        },
    });

    const buttonThemeGreen = createTheme({
        palette: {
            primary: green,
        },
    });

    const buttonThemeRed = createTheme({
        palette: {
            primary: red,
        },
    });

    let buttonTheme = buttonThemeGrey;
    if (color === 'red') {
        buttonTheme = buttonThemeRed;
    }

    let customButton;
    customButton = (
        <Button
            style={style}
            startIcon={startIcon}
            endIcon={endIcon}
            variant="contained"
            color="primary"
            size={size || 'medium'}
            onClick={onClick}
        >
            {title}
        </Button>
    );

    if (tooltip) {
        customButton = <Tooltip title={tooltip}>{customButton}</Tooltip>;
    }

    return <ThemeProvider theme={buttonTheme}>{customButton}</ThemeProvider>;
}

export default CustomButton;
