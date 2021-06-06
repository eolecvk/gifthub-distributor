import React, { Component } from "react";
import AdminViewSlider from "./AdminViewSlider"

// Mock Input (while still figuring out backend integration)
const props = {
    roomName: "TechCoop Money Pile #1",
    roomCode: "CCCS",
    splittingCents: 30000,
    people: [
        {
            name: "Eole",
            needsDescription: "Test Description",
            needsUpperBound: 4000,
            needsLowerBound: 2000,
            votes: [2500, 3000, 3212, 4000, 1234]
        },
        {
            name: "David",
            needsDescription: "Test Description",
            needsUpperBound: 4000,
            needsLowerBound: 2000,
            votes: [2500, 3000, 3212, 4000, 1234]
        },
        {
            name: "Oliver",
            needsDescription: "Test Description",
            needsUpperBound: 4000,
            needsLowerBound: 2000,
            votes: [2500, 3000, 3212, 4000, 1234]
        },
        {
            name: "Tyler",
            needsDescription: "Test Description",
            needsUpperBound: 4000,
            needsLowerBound: 2000,
            votes: [2500, 3000, 3212, 4000, 1234]
        },
        {
            name: "Brent",
            needsDescription: "Test Description",
            needsUpperBound: 4000,
            needsLowerBound: 2000,
            votes: [2500, 3000, 3212, 4000, 1234]
        },
        {
            name: "Roni",
            needsDescription: "Test Description",
            needsUpperBound: 4000,
            needsLowerBound: 2000,
            votes: [2500, 3000, 3212, 4000, 1234]
        },
    ]
};
class AdminView extends Component{
    //constructor(props){ // Once integrated, this will be input through the constructor
    constructor(){
        super(props);
        this.state = { roomName: props.roomName, splittingCents: props.splittingCents, people: props.people};
    }

    render(){
        const people = this.state.people
        const totalAmountDollars = this.state.splittingCents
    
        return (
            <div>
                <h1>Admin View Page</h1>
                <h2>{props.room_name}</h2>
                <h2>Total Amount: ${totalAmountDollars}</h2>
                {people.map(p => <AdminViewSlider name={ p.name } needsDescription = {p.needsDescription} needsUpperBound = {p.needsUpperBound} 
                    needsLowerBound = {p.needsLowerBound} totalAmountDollars = {totalAmountDollars} votes = {p.votes}></AdminViewSlider>)}
            </div>
        );
    }
}

export default AdminView;
