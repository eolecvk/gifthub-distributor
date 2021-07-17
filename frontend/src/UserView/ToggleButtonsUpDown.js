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
  const storedOpinion = sessionStorage.getItem("opinion") || ''

  const [opinion, setOpinion] = React.useState(storedOpinion);
  const roomInfo = JSON.parse(sessionStorage.getItem("roomInfo"))
  const roomCode = roomInfo.room_code

  const handleOpinion = (event, newOpinion) => {
    let emotiveChange = {}
    emotiveChange['kind'] = 'EMOTIVE'
    emotiveChange['bar_id'] = sliderId
    emotiveChange['emotion'] = newOpinion || opinion
    emotiveChange['toggle'] = newOpinion ? 'ON' : 'OFF'
    const events = [emotiveChange]

    sessionStorage.setItem("opinion", newOpinion)
    registerEmotive(events, roomCode)
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