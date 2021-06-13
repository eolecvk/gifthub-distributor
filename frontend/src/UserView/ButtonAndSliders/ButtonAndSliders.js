import React, { Component } from 'react'
import SliderGroup from '../SliderGroup/SliderGroup'

class ButtonAndSliders extends Component {

    constructor(props) {
        super(props)
        this.state = { defaultDistribution: 'zero' }
    }

    render() {
        return (
            <div>
                <div>
                    <h4>Quick distributions</h4>
                    <button onClick={e => this.setState({ defaultDistribution: 'zero' })}>Reset to 0</button>
                    <button onClick={e => this.setState({ defaultDistribution: 'equal' })}>Equal amounts</button>
                    <button onClick={e => this.setState({ defaultDistribution: 'survive' })}>Survive amounts</button>
                    <button onClick={e => this.setState({ defaultDistribution: 'thrive' })}>Thrive amounts</button>
                </div>
                <SliderGroup
                    roomInfo={this.props.roomInfo}
                    defaultDistribution={this.state.defaultDistribution}
                />
            </div>
        )
    }
}

export default ButtonAndSliders