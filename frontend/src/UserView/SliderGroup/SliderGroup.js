import { unstable_createMuiStrictModeTheme } from '@material-ui/core'
import React from 'react'
import InputSlider from '../InputSlider/InputSlider'

function SliderGroup(props) {
    return (
        props.people.map(userData =>
            <li key={userData.people_id.toString()}>
                <InputSlider
                    title={userData.name}
                    survive_amount={userData.needs_lower_bound_cents}
                    thrive_amount={userData.needs_upper_bound_cents} />
            </li>
        )
    )
}

export default SliderGroup

