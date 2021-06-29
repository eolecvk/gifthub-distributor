import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { getStartingValues, makeSliderGrid, registerVote } from './utils';
import ButtonsUndoRedo from './ButtonsUndoRedo'


class SliderGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentValues: getStartingValues(this.props.slidersInitializationData), // NEED TO DEPRECATED THIS
            reset: this.props.reset,
            history: {
                index: 0,
                states: [
                    getStartingValues(this.props.slidersInitializationData)
                ]
            }
        };
    }

    //REGISTER_VOTE
    //Initial vote when slider grid first gets mounted
    componentDidMount() {
        const voteData = this.state.currentValues;
        const roomCode = this.props.roomInfo.room_code;
        registerVote(voteData, roomCode);
    }

    // Generate updated version of state `currentState`
    // when inserting a new move of `newValue` at sliderId `id`
    getStateObjectNewMove = (currentState, id, newValue) => {
        return {
            currentValues: { ...currentState.currentValues, [`${id}`]: newValue }, // NEED TO DEPRECATED THIS
            reset: false,
            history: {
                index: currentState.history.index + 1,
                states: [
                    ...currentState.history.states.slice(0, currentState.history.index + 1),
                    { ...currentState.currentValues, [`${id}`]: newValue }
                ]
            }
        }
    }

    // Generate updated version of state `currentState`
    // when undoing one move
    getStateObjectOnUndo = (currentState) => {
        return {
            currentValues: currentState.history.states[currentState.history.index - 1], // NEED TO DEPRECATED THIS
            reset: currentState.reset,
            history: {
                index: currentState.history.index - 1,
                states: currentState.history.states
            }
        }
    }

    getStateObjectOnRedo = (currentState) => {
        return {
            currentValues: currentState.history.states[currentState.history.index + 1], // NEED TO DEPRECATED THIS
            reset: currentState.reset,
            history: {
                index: currentState.history.index + 1,
                states: currentState.history.states
            }
        }
    }


    handleUpdate = (id, newValue, isVote) => {
        let actualNewValue = newValue
        let futureState = this.getStateObjectNewMove(this.state, id, newValue)

        //Check if future state is valid (sum of money distributed <= totalAmount)
        // If not, distribute as much as possible in the slider moved last
        const futureTotalCost = Object.values(futureState.currentValues).reduce((a, b) => a + b);

        if (futureTotalCost > this.props.roomAmount) {
            const currentTotalCost = Object.values(this.state.currentValues).reduce(
                (a, b) => a + b
            );
            const currentValue = this.state.currentValues[id];
            const maxNewValue = this.props.roomAmount - currentTotalCost + currentValue;
            actualNewValue = maxNewValue
            futureState = this.getStateObjectNewMove(this.state, id, maxNewValue)
        }

        if (isVote) {
            const voteData = { [`${id}`]: actualNewValue };
            const roomCode = this.props.roomInfo.room_code;
            registerVote(voteData, roomCode);
        }
        this.setState(futureState);
    }


    undoMove = () => {

        // Assert undo is valid
        if (this.state.history.index === 0) {
            return
        }

        // Register vote for undo move
        const voteData = this.state.history.states[this.state.history.index - 1]
        const roomCode = this.props.roomInfo.room_code
        registerVote(voteData, roomCode)

        // Update state
        const newState = this.getStateObjectOnUndo(this.state)
        this.setState(newState)
    }

    redoMove = () => {

        // Assert redo is valid
        if (this.state.history.index === this.state.history.states.length - 1) {
            return
        }

        // Register vote for redo move
        const voteData = this.state.history.states[this.state.history.index + 1]
        const roomCode = this.props.roomInfo.room_code
        registerVote(voteData, roomCode)

        // Update state
        const newState = this.getStateObjectOnRedo(this.state)
        this.setState(newState)
    }


    render() {
        const sliders = makeSliderGrid(
            this.props.slidersInitializationData,
            this.state.currentValues,
            this.handleUpdate,
            this.state.reset
        );

        return (
            <div>
                <ButtonsUndoRedo
                    undoMove={this.undoMove}
                    redoMove={this.redoMove}
                />
                <p>
                    Amount distributed:{' '}
                    {Object.values(this.state.currentValues).length > 0
                        ? Object.values(this.state.currentValues)
                            .map((v) => (v ? v : 0))
                            .reduce((a, b) => a + b)
                        : 0}{' '}
                    / {this.props.roomAmount}
                </p>
                {sliders}
            </div>
        );
    }
}

export default withCookies(SliderGrid);
