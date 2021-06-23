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
            marginBottom: '40px',
        },
        slider:{
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
            "& .MuiSlider-valueLabel" : {
              "left": "auto"
            }
        }
    });

function AdminViewSlider(props) {
  const totalAmountDollars = props.totalAmountDollars
  const needsUpperBound = props.needsUpperBound
  const needsLowerBound = props.needsLowerBound
  const votes = props.votes
  const max = Math.max(Math.max(...votes), needsUpperBound);
  const avg = (props.avg * totalAmountDollars).toFixed(2)

  const name = props.name

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

  return ( 
    <div>
       <Typography variant="h5" gutterBottom className={props.classes.typography}>
            {name}
            <br />
            Current Avg: {avg} $
        </Typography>
        <Slider
          value={votes}
          valueLabelDisplay="on"
          disabled={true}
          marks={marks}
          className={props.classes.slider}
          max={max}
        />
    </div>
  );
}

export default withStyles(styles)(AdminViewSlider);