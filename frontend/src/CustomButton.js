import React from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';

function CustomButton(props) {
    const { title, onClick, size, tooltip, startIcon, color } = props;

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

    let buttonTheme = buttonThemeGreen;
    if (color === 'red') {
        buttonTheme = buttonThemeRed;
    }

    let customButton = (
        <Button
            startIcon={startIcon}
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
