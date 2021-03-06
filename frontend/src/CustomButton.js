import React from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { red, grey } from '@material-ui/core/colors';

function CustomButton(props) {
    const { title, onClick, size, tooltip, startIcon, endIcon, color, style } = props;

    const buttonThemeGrey = createTheme({
        palette: {
            primary: grey,
        },
    });

    let buttonTheme = buttonThemeGrey;

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
