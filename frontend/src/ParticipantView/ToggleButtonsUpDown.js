import React from 'react';
import axios from 'axios';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Grid from '@material-ui/core/Grid';

class ToggleButtonsUpDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opinion: 'unset',
        };
        this.recipientId = this.props.recipientId === '' ? '' : parseInt(this.props.recipientId);
        this.roomCode = this.props.roomCode;
        this.voterId = sessionStorage.getItem('voterId');
        this._isMounted = false; //using isMounted react pattern to avoid memory leak https://stackoverflow.com/questions/52061476/cancel-all-subscriptions-and-asyncs-in-the-componentwillunmount-method-how
    }

    componentDidMount = () => {
        const getOpinionFromBackend = async () => {
            const response = await axios.get(`/api/${this.roomCode}`);
            const responseData = await response.data;
            const emotive = this.parseEmotive(responseData, this.userId, this.recipientId);
            this._isMounted && this.setState({ opinion: emotive });
        };

        this._isMounted = true;
        if (this.state.opinion === 'unset') {
            this._isMounted && getOpinionFromBackend();
        }
    };

    componentWillUnmount() {
        this._isMounted = false;
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState.opinion === 'unset') {
            return false;
        }
        return true;
    };

    getRecipientData = (roomInfo, recipientId) => {
        return roomInfo.recipients.filter((el) => {
            return el.recipient_id === parseInt(recipientId);
        })[0];
    };

    // NEED TO REWRITE THIS CAUSE WE JUST NEED THE RESPONSE
    // NOT PARSING THE WHOLE ROOM INFO???
    parseEmotive = (roomInfo, voterId, recipientId) => {
        // Case: slider has been set to '' as we unmount the modal
        if (this.recipientId === '') {
            return '';
        }

        //Parse the emotive state value for a given voterId, recipientId
        //based on a roomInfo object
        const recipientData = this.getRecipientData(roomInfo, recipientId);
        if (Object.keys(recipientData.emotive).includes(parseInt(voterId))) {
            return recipientData.emotive[parseInt(voterId)];
        }
        return '';
    };

    handleOpinion = async (event, newOpinion) => {
        // Send newOpinion to backend
        // And set the state of the opinion toggle on the frontend
        // based on the confirmation from the backend
        let emotiveChange = {};
        emotiveChange['kind'] = 'EMOTIVE';
        emotiveChange['recipient_id'] = this.recipientId;
        emotiveChange['emotion'] = newOpinion || this.state.opinion;
        emotiveChange['toggle'] = newOpinion ? 'ON' : 'OFF';
        const payload = { events: [emotiveChange] };

        try {
            const response = await axios.put(`/api/${this.roomCode}`, payload);
            const responseData = await response.data;
            const emotive = this.parseEmotive(responseData, this.voterId, this.recipientId);
            this.setState({ opinion: emotive });
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        return (
            <Grid item xs>
                <ToggleButtonGroup
                    value={this.state.opinion}
                    exclusive
                    onChange={this.handleOpinion}
                    aria-label="Opinion on distribution"
                    size="large"
                >
                    <ToggleButton
                        id="dissentdown-button"
                        value="DISSENT_DOWN"
                        aria-label="Ask for less"
                    >
                        <span aria-label="index pointing down">👇</span>
                    </ToggleButton>
                    <ToggleButton
                        id="dissentup-button"
                        value="DISSENT_UP"
                        aria-label="Ask for more"
                    >
                        <span aria-label="index pointing up">👆</span>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
        );
    }
}

export default ToggleButtonsUpDown;
