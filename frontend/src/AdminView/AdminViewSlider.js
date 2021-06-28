import React from "react";
import Slider from "@material-ui/core/Slider";
import { withStyles, createStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';

// Storing this here as reference
// https://stackoverflow.com/questions/61206613/how-to-change-material-ui-slider-thumb-style-when-its-disabled

// TODO: Potentially move out into own/bootstrap css file
const styles = theme =>
  createStyles({
    typography: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    slider: {
      width: '80%',
      marginLeft: '10%',
      marginRight: '10%',
      marginBottom: '55px',
      "& .MuiSlider-thumb": {
        color: theme.palette.primary.main,
        "z-index": -1
      },
      "& .MuiSlider-mark": {
        "background-color": "#000",
        "height": "5px"
      },
      "& .MuiSlider-valueLabel": {
        "left": "auto"
      }
    }
  });

function AdminViewSlider(props) {

  const {
    sliderId,
    needsUpperBound,
    needsLowerBound,
    votes,
    avg,
    max,
    name
  } = props

  const marks = [
    {
      value: 0,
      label: '0 $',
    },
    {
      value: needsLowerBound,
      label: ':)',
    },
    {
      value: needsUpperBound,
      label: ':D',
    },
    {
      value: avg,
      label: 'Avg',
    }
  ];

  console.log(votes)

  return (
    <div key={'div' + sliderId}>
      <Typography
        variant="h5"
        gutterBottom
        className={props.classes.typography}
      >
        {name}
        <br />
        average: ${avg}
      </Typography>
      <Slider
        key={'slider' + sliderId}
        className={props.classes.slider}
        value={votes}
        valueLabelDisplay="on"
        disabled={true}
        marks={marks}
        max={max}
      />
    </div>
  );
}

export default withStyles(styles)(AdminViewSlider);