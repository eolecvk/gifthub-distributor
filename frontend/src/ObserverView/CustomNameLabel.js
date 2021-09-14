import React from 'react';
const CustomNameLabel = (props) => {
  const { x, y, width, height, value } = props;

  return (
    <g>
      <text>
        <tspan x={"7em"} dy={y+height/2.5}>{value.name}</tspan>
        <tspan x={"7em"} dy={"1.5em"}>{value.amt}</tspan>
      </text>
    </g>
  );
}

export default CustomNameLabel;
