import React, { Component } from 'react';
import { getStartingValues, registerVote, getStateObjectNewMoves } from './utils';
import InputSlider from './InputSlider';
import ButtonsUndoRedo from './ButtonsUndoRedo';
import AmountDistributedProgressBar from './AmountDistributedProgressBar';

class SliderGrid extends Component {
    constructor(props) {
        super(props);

        const defaultState = {
            currentValues: getStartingValues(this.props.slidersInitializationData), // NEED TO DEPRECATED THIS
            reset: this.props.reset,
            history: {
                index: 0,
                states: [getStartingValues(this.props.slidersInitializationData)],
            },
        };

        const storedState = JSON.parse(sessionStorage.getItem('sliderGridState'));
        const iniState = storedState || defaultState;
        //const iniState = this.props.reset ? defaultState : storedState
        this.state = iniState;
    }

    //Initial vote + initalization of the history in sessionStorage
    componentDidMount() {
        sessionStorage.setItem('sliderGridState', JSON.stringify(this.state));
        const voteData = this.state.currentValues;
        const roomCode = JSON.parse(sessionStorage.getItem('roomInfo')).room_code;
        registerVote(voteData, roomCode);
    }

    // Generate updated version of state `currentState`
    // when udating the value of `currentValue` (upon sliding the cursor mouse-down)
    // history does not get updated since it's a temporary change (no mouse-up event, no vote)
    getStateObjectNoMove = (currentState, id, newValue) => {
        return {
            currentValues: { ...currentState.currentValues, [`${id}`]: newValue }, // NEED TO DEPRECATED THIS
            reset: false,
            history: {
                index: currentState.history.index,
                states: [
                    ...currentState.history.states,
                    { ...currentState.currentValues, [`${id}`]: newValue },
                ],
            },
        };
    };

    // Generate updated version of state `currentState`
    // when inserting a new move of `newValue` at sliderId `id`
    getStateObjectNewMove = (currentState, id, newValue) => {
        const newSliderValues = { [`${id}`]: newValue };
        return getStateObjectNewMoves(currentState, newSliderValues);
        // return {
        //     currentValues: { ...currentState.currentValues, [`${id}`]: newValue }, // NEED TO DEPRECATED THIS
        //     reset: false,
        //     history: {
        //         index: currentState.history.index + 1,
        //         states: [
        //             ...currentState.history.states.slice(0, currentState.history.index + 1),
        //             { ...currentState.currentValues, [`${id}`]: newValue },
        //         ],
        //     },
        // };
    };

    // Generate updated version of state `currentState`
    // when undoing one move
    getStateObjectOnUndo = (currentState) => {
        return {
            currentValues: currentState.history.states[currentState.history.index - 1], // NEED TO DEPRECATED THIS
            reset: currentState.reset,
            history: {
                index: currentState.history.index - 1,
                states: currentState.history.states,
            },
        };
    };

    getStateObjectOnRedo = (currentState) => {
        return {
            currentValues: currentState.history.states[currentState.history.index + 1], // NEED TO DEPRECATED THIS
            reset: currentState.reset,
            history: {
                index: currentState.history.index + 1,
                states: currentState.history.states,
            },
        };
    };

    handleUpdateSlider = (id, newValue, isVote) => {
        let actualNewValue = newValue;
        let futureState = isVote
            ? this.getStateObjectNewMove(this.state, id, newValue)
            : this.getStateObjectNoMove(this.state, id, newValue);

        // UNCOMMENT THIS TO LIMIT AMOUNT SELECTED SO THAT SUM AMOUNTS <= TOTAL AMOUNT AVAILABLE
        //Check if future state is valid (sum of money distributed <= totalAmount)
        // If not, distribute as much as possible in the slider moved last
        // const futureTotalCost = Object.values(futureState.currentValues).reduce((a, b) => a + b);

        // if (futureTotalCost > this.props.roomAmount) {
        //     const currentTotalCost = Object.values(this.state.currentValues).reduce(
        //         (a, b) => a + b
        //     );
        //     const currentValue = this.state.currentValues[id];
        //     const maxNewValue = this.props.roomAmount - currentTotalCost + currentValue;
        //     actualNewValue = maxNewValue;
        //     futureState = isVote
        //         ? this.getStateObjectNewMove(this.state, id, maxNewValue)
        //         : this.getStateObjectNoMove(this.state, id, maxNewValue);
        // }

        if (isVote) {
            const voteData = { [`${id}`]: actualNewValue };
            const roomCode = JSON.parse(sessionStorage.getItem('roomInfo')).room_code;
            registerVote(voteData, roomCode);

            // is not part of registerVote
            //sessionStorage.setItem('sliderGridState', JSON.stringify(futureState));
        }
        this.setState(futureState);
    };

    undoMove = () => {
        // Assert undo is valid
        if (this.state.history.index === 0) {
            return;
        }

        // Register vote for undo move
        const voteData = this.state.history.states[this.state.history.index - 1];
        const roomCode = JSON.parse(sessionStorage.getItem('roomInfo')).room_code;
        registerVote(voteData, roomCode);

        // Update slider state stored in sessionStorage
        const newState = this.getStateObjectOnUndo(this.state);
        sessionStorage.setItem('sliderGridState', JSON.stringify(newState));
        this.setState(newState);
    };

    redoMove = () => {
        // Assert redo is valid
        if (this.state.history.index === this.state.history.states.length - 1) {
            return;
        }

        // Register vote for redo move
        const voteData = this.state.history.states[this.state.history.index + 1];
        const roomCode = JSON.parse(sessionStorage.getItem('roomInfo')).room_code;
        registerVote(voteData, roomCode);

        // Update slider state stored in sessionStorage
        const newState = this.getStateObjectOnRedo(this.state);
        sessionStorage.setItem('sliderGridState', JSON.stringify(newState));
        this.setState(newState);
    };

    render() {
        const sliders = this.props.slidersInitializationData
            .sort((sl1, sl2) => sl1.recipientId - sl2.recipientId)
            .map((slData) => {
                return (
                    <InputSlider
                        key={slData.recipientId.toString() + 'inputSlider'}
                        sliderId={slData.recipientId.toString()}
                        title={slData.title.toUpperCase()}
                        surviveValue={slData.surviveValue}
                        thriveValue={slData.thriveValue}
                        startingValue={
                            this.state.reset
                                ? slData.startingValue
                                : this.state.currentValues[slData.recipientId.toString()]
                        }
                        maxValue={slData.maxValue}
                        handleUpdateSlider={this.handleUpdateSlider}
                        handleOpenRecipientModal={this.props.openRecipientModal}
                        recipientInfo={this.props.roomInfo.recipients.find((p) => {
                            return p.recipient_id.toString() === slData.recipientId.toString();
                        })}
                    />
                );
            });

        const amountTotal = this.props.roomInfo.splitting_cents / 100;
        const amountDistributed =
            Object.values(this.state.currentValues).length > 0
                ? Object.values(this.state.currentValues)
                      .map((v) => (v ? v : 0))
                      .reduce((a, b) => a + b)
                : 0;

        return (
            <div>
                <AmountDistributedProgressBar
                    amountDistributed={amountDistributed}
                    amountTotal={amountTotal}
                />
                <ButtonsUndoRedo undoMove={this.undoMove} redoMove={this.redoMove} />
                <div style={{ marginTop: 50 }}>{sliders}</div>
            </div>
        );
    }
}

export default SliderGrid;
