import React from "react";
import Slider from "@material-ui/core/Slider";
import { withStyles } from "@material-ui/core/styles";

const CustomSlider = withStyles(theme => ({
  root: {
    width: '80%',
    margin:'10%' 
  },
  disabled: {
    color: theme.palette.primary.main
  },
  thumb: {
    color: "red"
  }
}))(Slider);


const marks = [
    {
      value: 0,
      label: '0 $',
    },
    {
      value: 20,
      label: '20 $',
    },
    {
      value: 37,
      label: '37 $',
    },
    {
      value: 100,
      label: '100 $',
    },
  ];
  
  function valuetext(value) {
    return `${value} $`;
  }

export default function AdminViewSlider() {
  return (
    <div>
        <CustomSlider
          defaultValue={[10, 15, 20, 30]}
          valueLabelDisplay="on"
          getAriaValueText={valuetext}
          disabled={true}
          marks={marks}
        />
    </div>
  );
}
