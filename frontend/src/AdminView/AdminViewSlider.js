import React from "react";
import Slider from "@material-ui/core/Slider";
import { withStyles, createStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';

// Storing this here as reference
// https://stackoverflow.com/questions/61206613/how-to-change-material-ui-slider-thumb-style-when-its-disabled

// TODO: Potentially move out into own/bootstrap css file
const styles = theme => 
    createStyles({
        typography:{
            textAlign: 'center',
            marginBottom: '50px',
        },
        slider:{
            width: '80%',
            marginLeft: '10%',
            marginRight: '10%',
            "& .MuiSlider-thumb": {
                color: theme.palette.primary.main,
                // TODO: Figure out sizing of thumb/thumb label? (related to adding in)
                //width: 200
                //width: 50
            }
        }
    });

// TODO: For totalAmount/personName values, find out how to take dynamic inputs 
const totalAmount = 100

const personName = "Tyler"

const marks = [
    {
      value: 0,
      label: '0 $',
    },
    {
      value: totalAmount * .25,
      label: `${totalAmount * .25} $`,
    },
    {
      value: totalAmount * .5,
      label: `${totalAmount * .5} $`,
    },
    {
      value: totalAmount * .75,
      label: `${totalAmount * .75} $`,
    },
    {
      value: totalAmount,
      label: `${totalAmount} $`,
    },
  ];
  
function valuetext(value) {
    return `${value} $`;
}

function AdminViewSlider(props) {
  return ( 
    <div>
       <Typography variant="h4" gutterBottom className={props.classes.typography}>
            {personName}
        </Typography>
        <Slider
          value={[5, 20, 100, 40]}
          valueLabelDisplay="on"
          //valueLabelFormat={valuetext} // TODO: Looking into a way to insert name here along label?
          getAriaValueText={valuetext} 
          disabled={true}
          marks={marks}
          className={props.classes.slider}
        />{" "}
    </div>
  );
}

export default withStyles(styles)(AdminViewSlider);