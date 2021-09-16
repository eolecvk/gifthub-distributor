import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        margin: '0px',
        padding: '5px',
        backgroundColor: 'rgb(255,255,255)',
        border: '1px solid rgb(204,204,204)',
        whiteSpace: 'nowrap',
        color: 'rgba(0, 0, 0, 0.87)',
        fontSize: 18,
    },
}))(Tooltip);

const CustomNameLabel = (props) => {
    const { x, y, height, value } = props;
    const { dissentUpNames, dissentDownNames, name, amt } = value;

    const dissentUpNamesHTML = dissentUpNames.map((entry, index) => <p key={index}>{entry}</p>);
    const dissentDownNamesHTML = dissentDownNames.map((entry, index) => <p key={index}>{entry}</p>);

    return (
        <g>
            <text>
                <HtmlTooltip title={dissentDownNames.length == 0 ? '' : dissentDownNamesHTML}>
                    <tspan x={x - 180} dy={y + height / 1.5}>
                        👇{dissentDownNames.length}
                    </tspan>
                </HtmlTooltip>
                <HtmlTooltip title={dissentUpNames.length == 0 ? '' : dissentUpNamesHTML}>
                    <tspan x={x - 135}>👆{dissentUpNames.length}</tspan>
                </HtmlTooltip>
            </text>
            <text>
                <tspan x={x - 90} dy={y + height / 2.5}>
                    {name}
                </tspan>
                <tspan x={x - 90} dy={25}>
                    {amt}
                </tspan>
            </text>
        </g>
    );
};

export default CustomNameLabel;
