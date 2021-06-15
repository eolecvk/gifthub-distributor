import React, { Component, useState, useEffect } from 'react'
import InputSlider from '../InputSlider/InputSlider'
import CustomSliderDev from '../UserView/CustomSliderDev'



function SliderGroup(props) {

    const [slidersData, setSlidersData] = useState(props.slidersInitializationData);

    useEffect(
        () => { setSlidersData(props.slidersInitializationData) },
        [props.slidersInitializationData]
    )

    return (
        slidersData.map(slData =>
            <li key={slData.peopleId.toString()}>
                <CustomSliderDev
                    title={slData.title}
                    surviveAmountCents={slData.surviveAmountCents}
                    thriveAmountCents={slData.thriveAmountCents}
                    startingValueCents={slData.startingValueCents}
                    maxValueCents={slData.maxValueCents}
                />
            </li>
        )
    )
}

export default SliderGroup



// OLD SHYTE

// class SliderGroup extends Component {

//     constructor(props) {
//         super(props) // slidersInitializationData
//         this.state = {
//             // MAYBE NO SINCE IT'S A PROP
//             // WHAT WE REALLY WANT IS THE STATE OF THE SLIDERS TO UPDATE, NOT THIS
//             resetDistribution: false,
//             defaultDistribution: this.props.defaultDistribution,

//             // NOT SINCE IT IS DERIVED FROM OTHER STATE VALUES!
//             //remainingAmountCents: this.props.roomInfo.splitting_cents

//             slidersInputs : []
//                 // {
//                 //     title // technically not a state
//                 //     surviveAmountCents // technically not a state
//                 //     thriveAmountCents // technically not a state
//                 //     valueCents // actually a state
//                 //     maxValueCents // technically not a state
//                 // }            
//         }
//     }

// Question: should I use memoization for the possible initialization states? (4 possibilities!)




//     // Sliders group gets re-renders when a button to set a default distribution is clicked
//     static getDerivedStateFromProps(newProps, prevState) {
//         return prevState.defaultDistribution === newProps.defaultDistribution
//             ? {}
//             : { defaultDistribution: newProps.defaultDistribution }
//     }

//     //Need to add a method to update remainingAmountCents when updating the value of individual sliders


//     render() {
//         let sliders
//         let remainingAmountCents

//         if (this.state.defaultDistribution === 'zero') {
//             sliders = this.props.roomInfo.people.map(userData =>
//                 <li key={userData.people_id.toString()}>
//                     <CustomSliderDev
//                         title={userData.name}
//                         surviveAmountCents={userData.needs_lower_bound_cents}
//                         thriveAmountCents={userData.needs_upper_bound_cents}
//                         startingValueCents={0}
//                         maxValueCents={this.props.roomInfo.splitting_cents} />
//                 </li>)
//         }
//         if (this.state.defaultDistribution === 'equal') {

//             remainingAmountCents = this.props.roomInfo.splitting_cents % this.props.roomInfo.people.length
//             if (!remainingAmountCents === this.state.remainingAmountCents) {
//                 this.setState({ remainingAmountCents: remainingAmountCents })
//             }

//             // can probably do better here (sum can be != 100)
//             const startingValueCents = Math.round(this.props.roomInfo.splitting_cents / this.props.roomInfo.people.length) 

//             sliders = this.props.roomInfo.people.map(userData =>
//                 <li key={userData.people_id.toString()}>
//                     <CustomSliderDev
//                         title={userData.name}
//                         surviveAmountCents={userData.needs_lower_bound_cents}
//                         thriveAmountCents={userData.needs_upper_bound_cents}
//                         startingValueCents={startingValueCents}
//                         maxValueCents={this.props.roomInfo.splitting_cents} />
//                 </li>)
//         }

//         return (
//             <div>
//                 <p className='remaining-amount'>
//                     Remaining amount: ${this.state.remainingAmountCents/100}
//                 </p>
//                 {sliders}
//             </div>
//         )
//     }
// }



// function distributionZero(roomInfo) {

//     const remainingAmountCents = roomInfo.splitting_cents
//     const sliders = roomInfo.people.map(userData =>
//         <li key={userData.people_id.toString()}>
//             <CustomSliderDev
//                 title={userData.name}
//                 surviveAmountCents={userData.needs_lower_bound_cents}
//                 thriveAmountCents={userData.needs_upper_bound_cents}
//                 startingValueCents={0}
//                 maxValueCents={roomInfo.splitting_cents} />
//         </li>)

//     return {
//         sliders: sliders,
//         remainingAmountCents: remainingAmountCents
//     }
// }

// function distributionEqual(roomInfo) {

//     const remainingAmountCents = roomInfo.splitting_cents % roomInfo.people.length
//     const startingValueCents = Math.round(roomInfo.splitting_cents / roomInfo.people.length) // can probably do better here (sum can be != 100)

//     const sliders = roomInfo.people.map(userData =>
//         <li key={userData.people_id.toString()}>
//             <CustomSliderDev
//                 title={userData.name}
//                 surviveAmountCents={userData.needs_lower_bound_cents}
//                 thriveAmountCents={userData.needs_upper_bound_cents}
//                 startingValueCents={startingValueCents}
//                 maxValueCents={roomInfo.splitting_cents} />
//         </li>)

//     return {
//         sliders: sliders,
//         remainingAmountCents: remainingAmountCents
//     }
// }


// function distributionSurvive(roomInfo) {

//     const totalSurviveAmountCents = roomInfo.people.reduce(
//         (prevPersonData, currentPersonData, index) =>
//             prevPersonData.needs_lower_bound_cents + currentPersonData.needs_lower_bound_cents, 0
//     )
//     const remainingAmountCents = roomInfo.splitting_cents - totalSurviveAmountCents

//     const sliders = roomInfo.people.map(userData =>
//         <li key={userData.people_id.toString()}>
//             <CustomSliderDev
//                 title={userData.name}
//                 surviveAmountCents={userData.needs_lower_bound_cents}
//                 thriveAmountCents={userData.needs_upper_bound_cents}
//                 startingValueCents={userData.needs_lower_bound_cents}
//                 maxValueCents={roomInfo.splitting_cents} />
//         </li>
//     )

//     // What if totalSurviveAmountCents < 0 ???
//     // Idea: input bars can grow to more than 100% to reflect the % we need to increase the budget to meet needs!

//     return {
//         sliders: sliders,
//         remainingAmountCents: remainingAmountCents
//     }
// }

// function distributionThrive(roomInfo) {

//     const totalThriveAmountCents = roomInfo.people.reduce(
//         (prevPersonData, currentPersonData, index) =>
//             prevPersonData.needs_upper_bound_cents + currentPersonData.needs_upper_bound_cents, 0
//     )

//     const remainingAmountCents = roomInfo.splitting_cents - totalThriveAmountCents

//     const sliders = roomInfo.people.map(userData =>
//         <li key={userData.people_id.toString()}>
//             <CustomSliderDev
//                 title={userData.name}
//                 surviveAmountCents={userData.needs_lower_bound_cents}
//                 thriveAmountCents={userData.needs_upper_bound_cents}
//                 startingValueCents={userData.needs_upper_bound_cents}
//                 maxValueCents={roomInfo.splitting_cents} />
//         </li>
//     )

//     // What if totalThriveAmountCents < 0 ???
//     // Idea: input bars can grow to more than 100% to reflect the % we need to increase the budget to meet needs!

//     return {
//         sliders: sliders,
//         remainingAmountCents: remainingAmountCents
//     }
// }

// function SliderGroup(props) {

//     let res

//     switch (props.defaultDistribution) {
//         case 'zero':
//             res = distributionZero(props.roomInfo)
//             break
//         case 'equal':
//             res = distributionEqual(props.roomInfo)
//             break
//         case 'survive':
//             res = distributionSurvive(props.roomInfo)
//             break
//         case 'thrive':
//             res = distributionThrive(props.roomInfo)
//             break
//         default:
//             res = distributionZero(props.roomInfo)
//             break
//     }

//     return (
//         <div>
//             <p className='remaining-amount'>
//                 Remaining amount: ${res.remainingAmountCents / 100}
//             </p>
//             {res.sliders}
//         </div>
//     )
// }


// class SliderGroup extends Component {

//     constructor(props) {
//         super(props)
//         this.state = {
//             remainingAmount: this.props.roomInfo.startingValueCents / 100
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

