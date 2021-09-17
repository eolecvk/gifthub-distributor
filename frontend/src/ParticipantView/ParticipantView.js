import React, { Component } from 'react';
import axios from 'axios';
import isEqual from 'lodash.isequal';
import { ButtonGroup, Grid } from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';
import RoomInfo from '../RoomInfo';
import SlidersGrid from './SliderGrid';
import ParticipantViewShadow from './ParticipantViewShadow';
import RecipientSlide from './RecipientSlide';
import {
    getSlidersInitializationData,
    getStartingValues,
    registerVote,
    getStateObjectNewMoves,
} from './utils';
import RecipientModal from './RecipientModal';
import UpdateDefaultDistributionModal from './UpdateDefaultDistributionModal';
import AddRecipientModal from './AddRecipientModal';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import PageviewIcon from '@material-ui/icons/Pageview';
import AmountDistributedProgressBar from './AmountDistributedProgressBar';
import CustomButton from '../CustomButton';

class ParticipantView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shadow: props.shadow,
            view: sessionStorage['participantView'] || 'list',
            defaultDistribution: 'zero',
            reset: false,
            roomInfo: JSON.parse(sessionStorage.getItem('roomInfo')) || '',
            recipientModalOpenAtSlider: '',
            slideOpenAtSlider: '',
            showDefaultDistributionModal: false,
            showAddRecipientModal: false,
        };
        this.getStateObjectNewMoves = getStateObjectNewMoves;
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
            this.intervalID = setTimeout(this.getData.bind(this), 10000);
        });
    };

    showQuickDistributionModal = () => {
        this.setState({ showDefaultDistributionModal: true });
    };

    hideQuickDistributionModal = () => {
        this.setState({ showDefaultDistributionModal: false });
    };

    showAddRecipientModal = () => {
        this.setState({ showAddRecipientModal: true });
    };

    hideAddRecipientModal = () => {
        this.setState({ showAddRecipientModal: false });
    };

    updateDefaultDistribution = (defaultDistribution) => {
        const roomInfo = this.state.roomInfo;
        const roomCode = roomInfo.room_code;

        const futureSlidersInitializationData = getSlidersInitializationData(
            roomInfo,
            defaultDistribution
        );
        const futureStartingValues = getStartingValues(futureSlidersInitializationData);

        registerVote(futureStartingValues, roomCode, true);

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
        const addRecipientModal = (
            <AddRecipientModal
                roomCode={this.state.roomInfo.room_code}
                show={this.state.showAddRecipientModal}
                handleCloseModal={this.hideAddRecipientModal}
                handleOpenModal={this.showAddRecipientModal}
            />
        );

        if (this.state.shadow) {
            return (
                <div>
                    <ParticipantViewShadow />
                    {addRecipientModal}
                </div>
            );
        }

        if (this.state.roomInfo.recipients.length === 0) {
            return (
                <div>
                    <RoomInfo roomInfo={this.state.roomInfo} />
                    {addRecipientModal}
                </div>
            );
        }

        const slidersInitializationData = getSlidersInitializationData(
            this.state.roomInfo,
            this.state.defaultDistribution
        );

        const recipient = this.state.roomInfo.recipients[0];

        const voterId = parseInt(sessionStorage.getItem('voterId'));

        const voter = this.state.roomInfo.voters.filter((voter) => {
            return voter.voter_id === voterId;
        })[0];

        const progressBar = (
            <AmountDistributedProgressBar
                amountDistributed={voter.distributed_cents / 100}
                amountTotal={this.state.roomInfo.splitting_cents / 100}
            />
        );
        if (this.state.view === 'list') {
            return (
                <div>
                    <RoomInfo roomInfo={this.state.roomInfo} />

                    <ButtonGroup orientation="vertical" style={{ marginTop: 10, marginBottom: 10 }}>
                        <CustomButton
                            title="Single Recipient View"
                            size="small"
                            startIcon={<PageviewIcon />}
                            onClick={() => {
                                if (this.state.roomInfo.recipients.length === 0) {
                                    return;
                                }
                                sessionStorage.setItem('participantView', 'zoomed');
                                this.setState({ view: 'zoomed' });
                            }}
                        />
                        <CustomButton
                            title="Quick distributions"
                            size="small"
                            startIcon={<OfflineBoltIcon />}
                            onClick={this.showQuickDistributionModal}
                        />
                    </ButtonGroup>

                    <UpdateDefaultDistributionModal
                        show={this.state.showDefaultDistributionModal}
                        hideQuickDistributionModal={this.hideQuickDistributionModal}
                        updateDefaultDistribution={this.updateDefaultDistribution}
                    />
                    {progressBar}
                    <SlidersGrid
                        key={this.state.defaultDistribution + Date.now()} // force class rendering on defaultDistribution update!
                        distribution={this.state.defaultDistribution}
                        slidersInitializationData={slidersInitializationData}
                        roomInfo={this.state.roomInfo}
                        reset={this.state.reset}
                        openRecipientModal={this.openRecipientModal}
                    />
                    {addRecipientModal}
                    <RecipientModal
                        recipientId={this.state.recipientModalOpenAtSlider}
                        closeRecipientModal={this.closeRecipientModal}
                    />
                </div>
            );
        }

        return (
            <div>
                <CustomButton
                    title="Back to list"
                    startIcon={<ListIcon />}
                    onClick={() => {
                        sessionStorage.setItem('participantView', 'list');
                        this.setState({ view: 'list' });
                    }}
                />
                <RecipientSlide
                    openAtRecipientId={recipient.recipient_id}
                    progressBar={progressBar}
                />
            </div>
        );
    }
}

export default ParticipantView;
