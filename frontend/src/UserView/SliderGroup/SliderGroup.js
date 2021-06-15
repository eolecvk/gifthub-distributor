import React, { Component, useState, useEffect } from 'react'
import CustomSlider from '../CustomSlider/CustomSlider'


function SliderGroup(props) {

    const [slidersData, setSlidersData] = useState(props.slidersInitializationData);

    useEffect(
        () => { setSlidersData(props.slidersInitializationData) },
        [props.slidersInitializationData]
    )

    return (
        slidersData.map(slData =>
            <li key={slData.peopleId.toString()}>
                <CustomSlider
                    title={slData.title}
                    surviveAmountCents={slData.surviveAmountCents}
                    thriveAmountCents={slData.thriveAmountCents}
                    startingValueCents={slData.startingValueCents}
                    maxValueCents={slData.maxValueCents}
                    key={slData.key}
                />
            </li>
        )
    )
}

export default SliderGroup