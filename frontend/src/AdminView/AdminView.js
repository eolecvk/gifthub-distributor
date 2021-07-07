import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';
import {VictoryChart, VictoryBar, VictoryScatter }from 'victory';
import colors from './../UserView/colors';
import { quantile } from "./utils";

// Example: https://blog.stvmlbrn.com/2019/02/20/automatically-refreshing-data-in-react.html
class AdminView extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
    };

    constructor(props) {
        super(props);

        const { cookies } = props;
        this.state = cookies.get('roomInfo') || '';
    }

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
            .then((response) => {
                this.setState({ people: response.data.people });
                // call getData() again in 1 second
                this.intervalID = setTimeout(this.getData.bind(this), 1000);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        const people = this.state.people;
        const totalAmountDollars = this.state.splitting_cents / 100;
        const roomCode = this.state.room_code;
        const roomName = this.state.room_name;

        const max =
            Math.min(
                this.state.splitting_cents,
                Math.max(
                    ...people.map((p) => p.votes_cents).flat(), // flat list of vote values in cents
                    ...people.map((p) => p.needs_upper_bound_cents) // flat list of upper bound needs in cents
                )) / 100;

        const data = people.map((p, index) => {
            const name = p.name;
            const cents = p.avg_cents/100;
            const needs_upper = p.needs_upper_bound_cents/100;
            const needs_lower = p.needs_lower_bound_cents/100;
            const upper_25 = quantile(p.votes_cents,0.75)/100;
            const lower_25 = quantile(p.votes_cents,0.25)/100;
            return {name:name, cents:cents, needs_upper:needs_upper, needs_lower:needs_lower, upper_25:upper_25, lower_25:lower_25, color:colors[index]};
        });

        const barchart = (
            <VictoryChart domainPadding={20} height={150} padding={{ top: 0, bottom: 50, left: 75, right: 25 }}>
                <VictoryBar
                    barRatio={4/data.length}
                    style={{ data: {fill: ({ datum }) => datum.color }}}
                    data={data}
                    x = "name"
                    y = "cents"
                    horizontal = {true}
                />
                <VictoryScatter data={data} symbol = "circle" x = "name" y = "needs_upper"  horizontal = {true} style={{ data: { fill: "#00FF00" } }}/>
                <VictoryScatter data={data} symbol = "circle" x = "name" y = "needs_lower"  horizontal = {true} style={{ data: { fill: "#FF0000" } }}/>
                <VictoryScatter data={data} symbol = "cross" x = "name" y = "upper_25"  horizontal = {true} style={{ data: { fill: "#000000" } }}/>
                <VictoryScatter data={data} symbol = "cross" x = "name" y = "lower_25"  horizontal = {true} style={{ data: { fill: "#000000" } }}/>
            </VictoryChart>
        );

        return (
            <div>
                <h1>Admin View Page</h1>
                <h2>{roomName}</h2>
                <h2>Room Code: {roomCode}</h2>
                <h2>Total Amount: ${totalAmountDollars}</h2>
                <div>
                    {barchart}
                </div>
            </div>
        );
    }
}

export default withCookies(AdminView);