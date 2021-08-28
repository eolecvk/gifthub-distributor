import React, { Component } from 'react';
import axios from 'axios';
import isEqual from 'lodash.isequal';
import RoomInfo from './RoomInfo';
import SlidersGrid from './SliderGrid';
import {
    getSlidersInitializationData,
    getStartingValues,
    registerVote,
} from './utils';
import RecipientModal from './RecipientModal';
import UpdateDefaultDistributionModal from './UpdateDefaultDistributionModal';
import ZoomOnBars from './ZoomOnBars'
import AddRecipientModal from './AddRecipientModal'

class ParticipantView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: sessionStorage['participantView'] || 'default',
            defaultDistribution: 'zero',
            reset: false,
            roomInfo: JSON.parse(sessionStorage.getItem('roomInfo')) || '',
            recipientModalOpenAtSlider: '',
        };
    }
    intervalID;

    componentDidMount() {
        document.title = 'Participant';
        this.getData();
    }

    componentWillUnmount() {
        clearTimeout(this.intervalID);
    }

    getData = () => {
        axios.get('/api/' + this.state.roomInfo.room_code).then((response) => {
            // Case : new recipient is detected in the backend roomInfo data compared to roomInfo in client state
            if (response.data.recipients.length !== this.state.roomInfo.recipients.length) {
                const roomCode = this.state.roomInfo.room_code;
                let newSliderValues = {};
                for (
                    let sliderValue = this.state.roomInfo.recipients.length + 1;
                    sliderValue <= response.data.recipients.length;
                    sliderValue++
                ) {
                    newSliderValues[sliderValue] = 0;
                }
                registerVote(newSliderValues, roomCode);
                this.setState({ roomInfo: response.data, reset: true });
            }

            // Case: no new recipient detected but average has moved?
            if (!isEqual(this.state.roomInfo, response.data)) {
                this.setState({ roomInfo: response.data, reset: false });
            }

            //Always update the local representation of room info
            sessionStorage.setItem('roomInfo', JSON.stringify(response.data));

            // call getData() again in 5 seconds
            this.intervalID = setTimeout(this.getData.bind(this), 2000);
        });
    };

    // Generate updated version of state `currentState`
    // when inserting a new move of `newValue` at sliderId `id`
    getStateObjectNewMoves = (currentState, newSliderValues) => {
        return {
            currentValues: { ...newSliderValues }, // NEED TO DEPRECATED THIS
            reset: false,
            history: {
                index: currentState.history.index + 1,
                states: [
                    ...currentState.history.states.slice(0, currentState.history.index + 1),
                    { ...newSliderValues },
                ],
            },
        };
    };

    updateDefaultDistribution = (defaultDistribution) => {
        const roomInfo = this.state.roomInfo;
        //const needsScaleDownRatio = getNeedsScaleDownRatio(roomInfo, defaultDistribution);
        const futureSlidersInitializationData = getSlidersInitializationData(
            roomInfo,
            defaultDistribution
        );
        const futureStartingValues = getStartingValues(futureSlidersInitializationData);

        // Update grid state stored in memory (will be used for slider grid initialization upon re-rendering)
        const storedSliderGridState = JSON.parse(sessionStorage.getItem('sliderGridState'));
        const defaultSliderGridState = {
            currentValues: futureStartingValues, // NEED TO DEPRECATED THIS
            reset: false,
            history: {
                index: 0,
                states: [futureStartingValues],
            },
        };
        const currentSliderGridState = storedSliderGridState || defaultSliderGridState;
        const futureSliderGridState = this.getStateObjectNewMoves(
            currentSliderGridState,
            futureStartingValues
        );
        sessionStorage.setItem('sliderGridState', JSON.stringify(futureSliderGridState));

        this.setState({
            defaultDistribution: defaultDistribution,
            reset: true,
        });
    };

    openRecipientModal = (sliderId) => {
        this.setState({
            ...this.state,
            recipientModalOpenAtSlider: sliderId === '' ? '' : parseInt(sliderId),
        });
    };

    closeRecipientModal = () => {
        this.openRecipientModal('');
    };

    render() {
        const slidersInitializationData = getSlidersInitializationData(
            this.state.roomInfo,
            this.state.defaultDistribution
        );

        const participantDefaultView = (
            <div>
                <RoomInfo roomInfo={this.state.roomInfo} />
                <span>
                    <UpdateDefaultDistributionModal
                        updateDefaultDistribution={this.updateDefaultDistribution}
                    />
                    <ZoomOnBars switchToZoomedView={() => {
                        sessionStorage.setItem('participantView', 'zoomed')
                        this.setState({ view: 'zoomed' })
                    }} />
                </span>
                <SlidersGrid
                    key={this.state.defaultDistribution + Date.now()} // force class rendering on defaultDistribution update!
                    distribution={this.state.defaultDistribution}
                    slidersInitializationData={slidersInitializationData}
                    roomInfo={this.state.roomInfo}
                    roomAmount={this.state.roomInfo.splitting_cents / 100}
                    reset={this.state.reset}
                    openRecipientModal={this.openRecipientModal}
                />
                <AddRecipientModal roomCode={this.state.roomInfo.room_code} />
                <RecipientModal
                    recipientId={this.state.recipientModalOpenAtSlider}
                    handleClose={this.closeRecipientModal}
                />
            </div>
        )

        const participantZoomedView = (
            <div>
                <button onClick={() => {
                    sessionStorage.setItem('participantView', 'default')
                    this.setState({ view: 'default' })
                }}>
                    Go back lol
                </button>
            </div>
        )

        const participantView = this.state.view === 'default'
            ? participantDefaultView
            : participantZoomedView

        return participantView
        // <div>
        //     <RoomInfo roomInfo={this.state.roomInfo} />
        //     <span>
        //         <UpdateDefaultDistributionModal
        //             updateDefaultDistribution={this.updateDefaultDistribution}
        //         />
        //         <ZoomOnBars />
        //     </span>
        //     <SlidersGrid
        //         key={this.state.defaultDistribution + Date.now()} // force class rendering on defaultDistribution update!
        //         distribution={this.state.defaultDistribution}
        //         slidersInitializationData={slidersInitializationData}
        //         roomInfo={this.state.roomInfo}
        //         roomAmount={this.state.roomInfo.splitting_cents / 100}
        //         reset={this.state.reset}
        //         openRecipientModal={this.openRecipientModal}
        //     />
        //     <AddRecipientModal roomCode={this.state.roomInfo.room_code} />
        //     <RecipientModal
        //         recipientId={this.state.recipientModalOpenAtSlider}
        //         handleClose={this.closeRecipientModal}
        //     />
        // </div>
    }
}

export default ParticipantView;
