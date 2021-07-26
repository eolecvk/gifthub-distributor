import React, { Component } from 'react';
import { ComposedChart, XAxis, YAxis, Bar, Cell, ResponsiveContainer, Scatter } from 'recharts';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';
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
                // call getData() again in 5 seconds
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

        const data = people.map((p) => {
            const name = p.name;
            const cents = p.avg_cents/100;
            const needs_upper = p.needs_upper_bound_cents/100;
            const needs_lower = p.needs_lower_bound_cents/100;
            const upper_25 = quantile(p.votes_cents,0.75)/100;
            const lower_25 = quantile(p.votes_cents,0.25)/100;
            return {name:name, cents:cents, needs_upper:needs_upper, needs_lower:needs_lower, upper_25:upper_25, lower_25:lower_25};
        });
        const barchart = (
            <ResponsiveContainer width="95%" height="80%" minHeight={100* people.length}>
                <ComposedChart width={720} height={480} data={data} layout="vertical">
                    <YAxis type="category" dataKey="name"/>
                    <XAxis type="number"/>
                    <Bar dataKey="cents">
                        {
                            people.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index+1]} />
                            ))
                        }
                    </Bar>
                    <Scatter shape="circle" dataKey="needs_upper" fill="#00FF00"/>
                    <Scatter shape="circle" dataKey="needs_lower" fill="#FF0000"/>
                    <Scatter shape="cross" dataKey="upper_25" fill="#000000"/>
                    <Scatter shape="cross" dataKey="lower_25" fill="#000000"/>
                </ComposedChart>
            </ResponsiveContainer>
        );

        return (
            <div>
                <h1>Admin View Page</h1>
                <h2>{roomName}</h2>
                <h2>Room Code: {roomCode}</h2>
                <h2>Total Amount: ${totalAmountDollars}</h2>
                <div style={{display:'flex', 'flex-flow':'column', height:'100%'}}>
                    {barchart}
                </div>
            </div>
        );
    }
}

export default withCookies(AdminView);
