import React from 'react';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


//TODO:
// Define callback function `updateOpinion` with backend call to Emotive API
// Add ToggleButtons to sliderGrid
// Test 

export default function ToggleButtons(props) {
  const [opinion, setOpinion] = React.useState('');

  const {sliderId, updateOpinion} = props

  const handleOpinion = (event, newOpinion) => {
    updateOpinion(sliderId, newOpinion)
    setOpinion(newOpinion);
  };

  return (
    <ToggleButtonGroup
      value={opinion}
      exclusive
      onChange={handleOpinion}
      aria-label="Opinion on distribution"
    >
      <ToggleButton value="less" aria-label="Ask for less">
        <RemoveIcon />
      </ToggleButton>
      <ToggleButton value="more" aria-label="Ask for more">
        <AddIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}