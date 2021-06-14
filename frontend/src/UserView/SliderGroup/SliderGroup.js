import React, { Component } from 'react'
import InputSlider from '../InputSlider/InputSlider'


function distributionZero(roomInfo) {

    const remainingAmountCents = roomInfo.splitting_cents
    const sliders = roomInfo.people.map(userData =>
        <li key={userData.people_id.toString()}>
            <InputSlider
                title={userData.name}
                surviveAmountCents={userData.needs_lower_bound_cents}
                thriveAmountCents={userData.needs_upper_bound_cents}
                startingValueCents={0}
                maxValueCents={roomInfo.splitting_cents} />
        </li>)

    return {
        sliders: sliders,
        remainingAmountCents: remainingAmountCents
    }
}

function distributionEqual(roomInfo) {

    const remainingAmountCents = roomInfo.splitting_cents % roomInfo.people.length
    const startingValueCents = Math.round(roomInfo.splitting_cents / roomInfo.people.length) // can probably do better here (sum can be != 100)

    const sliders = roomInfo.people.map(userData =>
        <li key={userData.people_id.toString()}>
            <InputSlider
                title={userData.name}
                surviveAmountCents={userData.needs_lower_bound_cents}
                thriveAmountCents={userData.needs_upper_bound_cents}
                startingValueCents={startingValueCents}
                maxValueCents={roomInfo.splitting_cents} />
        </li>)

    return {
        sliders: sliders,
        remainingAmountCents: remainingAmountCents
    }
}


function distributionSurvive(roomInfo) {

    const totalSurviveAmountCents = roomInfo.people.reduce(
        (prevPersonData, currentPersonData, index) =>
            prevPersonData.needs_lower_bound_cents + currentPersonData.needs_lower_bound_cents, 0
    )
    const remainingAmountCents = roomInfo.splitting_cents - totalSurviveAmountCents

    const sliders = roomInfo.people.map(userData =>
        <li key={userData.people_id.toString()}>
            <InputSlider
                title={userData.name}
                surviveAmountCents={userData.needs_lower_bound_cents}
                thriveAmountCents={userData.needs_upper_bound_cents}
                startingValueCents={userData.needs_lower_bound_cents}
                maxValueCents={roomInfo.splitting_cents} />
        </li>
    )

    // What if totalSurviveAmountCents < 0 ???
    // Idea: input bars can grow to more than 100% to reflect the % we need to increase the budget to meet needs!

    return {
        sliders: sliders,
        remainingAmountCents: remainingAmountCents
    }
}

function distributionThrive(roomInfo) {

    const totalThriveAmountCents = roomInfo.people.reduce(
        (prevPersonData, currentPersonData, index) =>
            prevPersonData.needs_upper_bound_cents + currentPersonData.needs_upper_bound_cents, 0
    )

    const remainingAmountCents = roomInfo.splitting_cents - totalThriveAmountCents

    const sliders = roomInfo.people.map(userData =>
        <li key={userData.people_id.toString()}>
            <InputSlider
                title={userData.name}
                surviveAmountCents={userData.needs_lower_bound_cents}
                thriveAmountCents={userData.needs_upper_bound_cents}
                startingValueCents={userData.needs_upper_bound_cents}
                maxValueCents={roomInfo.splitting_cents} />
        </li>
    )

    // What if totalThriveAmountCents < 0 ???
    // Idea: input bars can grow to more than 100% to reflect the % we need to increase the budget to meet needs!

    return {
        sliders: sliders,
        remainingAmountCents: remainingAmountCents
    }
}

function SliderGroup(props) {

    let res

    console.log('defaultDistribution: ' + props.defaultDistribution)
    switch (props.defaultDistribution) {
        case 'zero':
            res = distributionZero(props.roomInfo)
            break
        case 'equal':
            res = distributionEqual(props.roomInfo)
            break
        case 'survive':
            res = distributionSurvive(props.roomInfo)
            break
        case 'thrive':
            res = distributionThrive(props.roomInfo)
            break
        default:
            res = distributionZero(props.roomInfo)
            break
    }

    return (
        <div>
            <p className='remaining-amount'>
                Remaining amount: ${res.remainingAmountCents / 100}
            </p>
            {res.sliders}
        </div>
    )
}


// class SliderGroup extends Component {

//     constructor(props) {
//         super(props)
//         this.state = {
//             remainingAmount: this.props.startingValueCents / 100
//         }
//     }

//     distribution(props) {

//         let res
//         switch (props.defaultDistribution) {
//             case 'zero':
//                 return distributionZero(props.roomInfo)
//             case 'equal':
//                 return distributionEqual(props.roomInfo)
//             case 'survive':
//                 return distributionSurvive(props.roomInfo)
//             case 'thrive':
//                 return distributionThrive(props.roomInfo)
//             default:
//                 return distributionZero(props.roomInfo)
//         }
//     }


//     render() {

//         const { sliders, remainingAmountCents } = this.distribution(this.props)

//         return (
//             <div>
//                 <p className='remaining-amount'>
//                     Remaining amount: ${remainingAmountCents / 100}
//                 </p>
//                 {sliders}
//             </div >
//         )
//     }
// }

export default SliderGroup