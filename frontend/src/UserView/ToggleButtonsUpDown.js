import React, { useEffect } from 'react';
import axios from 'axios';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

function ToggleButtonsUpDown(props) {



  const { sliderId } = props
  const sliderIdRef = React.useRef(sliderId)
  const userId = sessionStorage.getItem("userId")
  const roomInfo = JSON.parse(sessionStorage.getItem("roomInfo"))
  const roomCode = roomInfo.room_code

  // NEED FIX FOR TOGGLE RERENDERING
  // (React.memo not working)
  // suggestion: take ToggleButtonsUpDown outside of InputSlider and put it in SliderGrid instead?

  const [opinion, setOpinion] = React.useState('unset')

  //Upon mounting the component, make a request to the backend
  //to set the initial state of the toggle
  useEffect(() => {
    const getOpinion = async () => {
      const response = await axios.get(`/api/${roomCode}`)
      const responseData = await response.data
      const emotive = parseEmotive(responseData, userId, sliderId)
      if (opinion === 'unset') {
        setOpinion(emotive)
      }
    }
    getOpinion();
  }, []);

  const parseEmotive = (roomInfo, userId, sliderId) => {
    //Parse the emotive state value for a given userId and sliderId
    //based on a roomInfo object
    const userData = roomInfo.people.filter((el) => { return (el.person_id === parseInt(userId)) })[0]
    if (
      typeof userData.emotive.DISSENT_UP !== 'undefined' &&
      userData.emotive.DISSENT_UP.includes(parseInt(sliderId))) {
      return 'DISSENT_UP'
    }
    if (
      typeof userData.emotive.DISSENT_DOWN !== 'undefined' &&
      userData.emotive.DISSENT_DOWN.includes(parseInt(sliderId))) {
      return 'DISSENT_DOWN'
    }
    return ''
  }

  const handleOpinion = async (event, newOpinion) => {
    // Send newOpinion to backend
    // And set the state of the opinion toggle on the frontend
    // based on the confirmation from the backend
    let emotiveChange = {}
    emotiveChange['kind'] = 'EMOTIVE'
    emotiveChange['bar_id'] = sliderId
    emotiveChange['emotion'] = newOpinion || opinion
    emotiveChange['toggle'] = newOpinion ? 'ON' : 'OFF'
    const payload = { events: [emotiveChange] }
    const response = await axios.put(`/api/${roomCode}`, payload)
    const responseData = await response.data
    const emotive = parseEmotive(responseData, userId, sliderId)
    setOpinion(emotive)
  }

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

const MemoizedToggleButtonsUpDown = React.memo(ToggleButtonsUpDown)
export default MemoizedToggleButtonsUpDown