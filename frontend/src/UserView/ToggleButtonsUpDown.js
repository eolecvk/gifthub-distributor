import React from 'react';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { registerEmotive } from './utils';

//TODO:
// Define callback function `updateOpinion` with backend call to Emotive API
// Add ToggleButtons to sliderGrid
// Test 

function ToggleButtonsUpDown(props) {

  const { sliderId } = props
  const roomInfo = JSON.parse(sessionStorage.getItem("roomInfo"))
  const roomCode = roomInfo.room_code

  //Access stored opinions in localStorage
  //and set state to existing value if applicable
  const storedOpinions = JSON.parse(sessionStorage.getItem("opinions")) || {}
  const barsWithOpinions = Object.keys(storedOpinions)
  const storedOpinion = barsWithOpinions.includes(sliderId) ? storedOpinions[sliderId] : ''
  const [opinion, setOpinion] = React.useState(storedOpinion);

  const handleOpinion = (event, newOpinion) => {

    let emotiveChange = {}
    emotiveChange['kind'] = 'EMOTIVE'
    emotiveChange['bar_id'] = sliderId
    emotiveChange['emotion'] = newOpinion || opinion
    emotiveChange['toggle'] = newOpinion ? 'ON' : 'OFF'
    const events = [emotiveChange]

    //Update stored emotion by bar_id in sessionStorage
    let opinionsUpdated = storedOpinions
    opinionsUpdated[sliderId] = newOpinion
    sessionStorage.setItem("opinions", JSON.stringify(opinionsUpdated))

    //Send request to backend to update emotive data
    registerEmotive(events, roomCode)

    // Update component state
    setOpinion(newOpinion);
  };

  return (
    <ToggleButtonGroup
      value={opinion}
      exclusive
      onChange={handleOpinion}
      aria-label="Opinion on distribution"
    >
      <ToggleButton
        value="DISSENT_DOWN"
        aria-label="Ask for less"
      >
        <RemoveIcon />
      </ToggleButton>
      <ToggleButton
        value="DISSENT_UP"
        aria-label="Ask for more"
      >
        <AddIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default ToggleButtonsUpDown