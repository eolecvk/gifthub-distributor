import React, { Component } from 'react'
import SliderGroup from '../SliderGroup/SliderGroup'

class ButtonAndSliders extends Component {

    constructor(props) {
        super(props)
        this.state = { defaultDistribution: 'zero', items: [] }
        this.getSlidersInitializationData = this.getSlidersInitializationData.bind(this)
    }

    getSlidersInitializationData(props) {

        if (this.state.defaultDistribution === 'zero') {
            return (
                props.roomInfo.people.map(
                    userData => (
                        {
                            "peopleId": userData.people_id,
                            "title": userData.name,
                            "surviveAmountCents": userData.needs_lower_bound_cents,
                            "thriveAmountCents": userData.needs_upper_bound_cents,
                            "startingValueCents": 0,
                            "maxValueCents": props.roomInfo.splitting_cents,
                            "key": new Date().getTime().toString()
                        }
                    )
                )
            )
        }

        if (this.state.defaultDistribution === 'equal') {
            return (
                props.roomInfo.people.map(
                    userData => (
                        {
                            "peopleId": userData.people_id,
                            "title": userData.name,
                            "surviveAmountCents": userData.needs_lower_bound_cents,
                            "thriveAmountCents": userData.needs_upper_bound_cents,
                            "startingValueCents": props.roomInfo.splitting_cents / props.roomInfo.people.length,
                            "maxValueCents": props.roomInfo.splitting_cents,
                            "key": new Date().getTime().toString()
                        }
                    )
                )
            )
        }

        if (this.state.defaultDistribution === 'survive') {
            return (
                props.roomInfo.people.map(
                    userData => (
                        {
                            "peopleId": userData.people_id,
                            "title": userData.name,
                            "surviveAmountCents": userData.needs_lower_bound_cents,
                            "thriveAmountCents": userData.needs_upper_bound_cents,
                            "startingValueCents": userData.needs_lower_bound_cents,
                            "maxValueCents": props.roomInfo.splitting_cents,
                            "key": new Date().getTime().toString()
                        }
                    )
                )
            )
        }

        if (this.state.defaultDistribution === 'thrive') {
            return (
                props.roomInfo.people.map(
                    userData => (
                        {
                            "peopleId": userData.people_id,
                            "title": userData.name,
                            "surviveAmountCents": userData.needs_lower_bound_cents,
                            "thriveAmountCents": userData.needs_upper_bound_cents,
                            "startingValueCents": userData.needs_upper_bound_cents,
                            "maxValueCents": props.roomInfo.splitting_cents,
                            "key": new Date().getTime().toString()
                        }
                    )
                )
            )
        }

    }

    render() {

        const slidersInitializationData = this.getSlidersInitializationData(this.props)
        console.log(slidersInitializationData)

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
                    slidersInitializationData={slidersInitializationData}
                />
            </div>
        )
    }
}

export default ButtonAndSliders