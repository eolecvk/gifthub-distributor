import React from 'react'
import { useCookies } from "react-cookie";
import InputSlider from '../Slider/Slider'


function InputPage() {

    const [cookies, setCookie] = useCookies(["roomInfo"]);

    console.log(cookies.roomInfo)

    const amountDollars = (cookies.roomInfo.splitting_cents / 100).toFixed(2);

    const inputList = cookies.roomInfo.people.map(userData => <InputSlider title={userData.name} />)

    return (
        <div>
            <h1>Input Page</h1>
            <h2>{cookies.roomInfo.room_name}</h2>
            <h2>Amount: ${amountDollars}</h2>
            {inputList}
        </div>
    )
}
export default InputPage;