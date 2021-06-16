import React, { Component } from "react";
import AdminViewSlider from "./AdminViewSlider"
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios'

// Mock Input (while still figuring out backend integration)
// const props = {
//     roomName: "TechCoop Money Pile #1",
//     roomCode: "CCCS",
//     splittingCents: 30000,
//     people: [
//         {
//             name: "Eole",
//             needsUpperBound: 4000,
//             needsLowerBound: 2000,
//             votes: [2500, 3000, 3212, 5000, 1234]
//         },
//         {
//             name: "David",
//             needsUpperBound: 4000,
//             needsLowerBound: 2000,
//             votes: [2500, 3000, 3212, 5000, 1234]
//         },
//         {
//             name: "Oliver",
//             needsUpperBound: 4000,
//             needsLowerBound: 2000,
//             votes: [2500, 3000, 3212, 5000, 1234]
//         },
//         {
//             name: "Tyler",
//             needsUpperBound: 4000,
//             needsLowerBound: 2000,
//             votes: [2500, 3000, 3212, 5000, 1234]
//         },
//         {
//             name: "Brent",
//             needsUpperBound: 4000,
//             needsLowerBound: 2000,
//             votes: [2500, 3000, 3212, 5000, 1234]
//         },
//         {
//             name: "Roni",
//             needsUpperBound: 4000,
//             needsLowerBound: 2000,
//             votes: [2500, 3000, 3212, 5000, 1234]
//         },
//     ]
// };
class AdminView extends Component{
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
      };
    
    constructor(props) {
        super(props);
     
        const { cookies } = props;
        this.state = cookies.get("roomInfo") || "";
      }

    // Example: https://blog.stvmlbrn.com/2019/02/20/automatically-refreshing-data-in-react.html
    intervalID;

    componentDidMount() {
      this.getData();
    }

    componentWillUnmount() {
      clearTimeout(this.intervalID);
    }

    getData = () => {
      axios
        .get('/api/' + this.state.room_code)
        .then(response => {
          this.setState({ people: response.data.people});
          // call getData() again in 5 seconds
          this.intervalID = setTimeout(this.getData.bind(this), 5000);
        });
    }

    render(){
        const people = this.state.people
        const totalAmountDollars = this.state.splitting_cents * 100
        const roomCode = this.state.room_code
        const roomName = this.state.room_name
    
        return (
            <div>
                <h1>Admin View Page</h1>
                <h2>{roomName}</h2>
                <h2>Room Code: {roomCode}</h2>
                <h2>Total Amount: ${totalAmountDollars}</h2>
                {people.map(p => <AdminViewSlider name={ p.name } needsUpperBound = {p.needsUpperBound} 
                    needsLowerBound = {p.needsLowerBound} totalAmountDollars = {totalAmountDollars} votes = {p.votes} avg = {p.avg}></AdminViewSlider>)}
            </div>
        );
    }
}

export default withCookies(AdminView);
