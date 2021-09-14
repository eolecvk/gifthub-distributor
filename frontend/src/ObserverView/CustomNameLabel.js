import React from 'react';
const CustomNameLabel = (props) => {
    const { x, y, height, value } = props;

    return (
        <g>
            <text>
                <tspan x={x - 90} dy={y + height / 2.5}>
                    {value.name}
                </tspan>
                <tspan x={x - 90} dy={25}>
                    {value.amt}
                </tspan>
            </text>
        </g>
    );
};

export default CustomNameLabel;
