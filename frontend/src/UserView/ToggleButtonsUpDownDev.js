import React from 'react'
import axios from 'axios';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Grid from '@material-ui/core/Grid';

class ToggleButtonsUpDownDev extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            opinion: 'unset'
        }
        this.sliderId = this.props.sliderId
        this.userId = sessionStorage.getItem("userId")
        this.roomCode = JSON.parse(sessionStorage.getItem("roomInfo")).room_code
        this._isMounted = false; //using isMounted react pattern to avoid memory leak https://stackoverflow.com/questions/52061476/cancel-all-subscriptions-and-asyncs-in-the-componentwillunmount-method-how
    }

    componentDidMount = () => {
        const getOpinionFromBackend = async () => {
            const response = await axios.get(`/api/${this.roomCode}`)
            const responseData = await response.data
            const emotive = this.parseEmotive(responseData, this.userId, this.sliderId)
            this._isMounted && this.setState({ opinion: emotive })
        }

        this._isMounted = true;
        if (this.state.opinion === 'unset') {
            this._isMounted && getOpinionFromBackend()
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState.opinion === 'unset') {
            return false
        }
        return true
    }

    parseEmotive = (roomInfo, userId, sliderId) => {
        //Parse the emotive state value for a given userId and sliderId
        //based on a roomInfo object
        const userData = roomInfo.people.filter((el) => { return (el.person_id === parseInt(sliderId)) })[0]
        if (
            typeof userData.emotive.DISSENT_UP !== 'undefined' &&
            userData.emotive.DISSENT_UP.includes(parseInt(userId))) {
            return 'DISSENT_UP'
        }
        if (
            typeof userData.emotive.DISSENT_DOWN !== 'undefined' &&
            userData.emotive.DISSENT_DOWN.includes(parseInt(userId))) {
            return 'DISSENT_DOWN'
        }
        return ''
    }

    handleOpinion = async (event, newOpinion) => {
        // Send newOpinion to backend
        // And set the state of the opinion toggle on the frontend
        // based on the confirmation from the backend
        let emotiveChange = {}
        emotiveChange['kind'] = 'EMOTIVE'
        emotiveChange['bar_id'] = this.sliderId
        emotiveChange['emotion'] = newOpinion || this.state.opinion
        emotiveChange['toggle'] = newOpinion ? 'ON' : 'OFF'
        const payload = { events: [emotiveChange] }
        const response = await axios.put(`/api/${this.roomCode}`, payload)
        const responseData = await response.data
        const emotive = this.parseEmotive(responseData, this.userId, this.sliderId)
        this.setState({ opinion: emotive })
    }

    render() {
        return (
            <Grid item>
                <ToggleButtonGroup
                    value={this.state.opinion}
                    exclusive
                    onChange={this.handleOpinion}
                    aria-label="Opinion on distribution"
                >
                    <ToggleButton
                        value="DISSENT_DOWN"
                        aria-label="Ask for less"
                        style={{ fontSize: '20px' }}
                    >
                            <span aria-label="index pointing down" role="img">👇</span>

                    </ToggleButton>
                    <ToggleButton
                        value="DISSENT_UP"
                        aria-label="Ask for more"
                        style={{ fontSize: '20px' }}
                    >
                        <span aria-label="index pointing up" role="img">👆</span>
                    </ToggleButton>
                </ToggleButtonGroup >
            </Grid>
        )
    }
}

export default ToggleButtonsUpDownDev