import React from 'react'
import InputSlider from '../Slider/Slider'

function SliderGroup(props) {
    return (
        props.people.map(userData =>
            <li key={userData.people_id.toString()}>
                <InputSlider title={userData.name} />
            </li>
        )
    )
}

export default SliderGroup

