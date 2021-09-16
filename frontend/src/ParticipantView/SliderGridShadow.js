import React, { Component } from 'react';
import { getStartingValues } from './utils';
import InputSliderShadow from './InputSliderShadow';

class SliderGridShadow extends Component {
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
        this.state = iniState;
    }

    render() {
        const sliders = this.props.slidersInitializationData
            .sort((sl1, sl2) => sl1.recipientId - sl2.recipientId)
            .map((slData) => {
                return (
                    <InputSliderShadow
                        key={slData.recipientId.toString() + 'inputSlider'}
                        sliderId={slData.recipientId.toString()}
                        title={slData.title}
                        surviveValue={slData.surviveValue}
                        thriveValue={slData.thriveValue}
                        startingValue={
                            this.state.reset
                                ? slData.startingValue
                                : this.state.currentValues[slData.recipientId.toString()]
                        }
                        maxValue={slData.maxValue}
                        openRecipientModal={this.props.openRecipientModal}
                        recipientInfo={this.props.roomInfo.recipients.find((p) => {
                            return p.recipient_id.toString() === slData.recipientId.toString();
                        })}
                    />
                );
            });

        return <div style={{ marginTop: 50 }}>{sliders}</div>;
    }
}

export default SliderGridShadow;
