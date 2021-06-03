import React, { Component } from 'react'
import InputSlider from './Sliders'



function InputPage() {
    return (
        <div>
            <h1>Input Page</h1>
            <h2>Room Name</h2>
            <h2>Amount: $xx,xx</h2>
            <InputSlider title='username_A'/>
            <InputSlider title='username_B'/>
            <InputSlider title='username_C'/>
        </div>
    )
}
export default InputPage;