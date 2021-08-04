import React, { Component } from 'react';
import { ComposedChart, XAxis, YAxis, Bar, Cell, ResponsiveContainer, Scatter } from 'recharts';
import axios from 'axios';
import colors from './../UserView/colors';
import { quantile } from "./utils";


// Example: https://blog.stvmlbrn.com/2019/02/20/automatically-refreshing-data-in-react.html
class AdminView extends Component {

    constructor() {
        super()
        this.state = JSON.parse(sessionStorage.getItem("roomInfo")) || '';
    }

    intervalID;

    componentDidMount() {
        document.title = 'Admin View';
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

        const data = people
            .sort((p1, p2) => p1.person_id - p2.person_id)
            .map((p) => {
                const name = p.name;
                const cents = p.avg_cents / 100;
                const needs_upper = p.needs_upper_bound_cents / 100;
                const needs_lower = p.needs_lower_bound_cents / 100;
                const upper_25 = quantile(p.votes_cents, 0.75) / 100;
                const lower_25 = quantile(p.votes_cents, 0.25) / 100;

                const countDissentUp = p.emotive.DISSENT_UP ? p.emotive.DISSENT_UP.length : 0
                const countDissentDown = p.emotive.DISSENT_DOWN ? p.emotive.DISSENT_DOWN.length : 0
                const dissent = `👇 ${countDissentDown} / 👆 ${countDissentUp}`

                return {
                    name: name,
                    dissent: dissent,
                    cents: cents,
                    needs_upper: needs_upper,
                    needs_lower: needs_lower,
                    upper_25: upper_25,
                    lower_25: lower_25
                };
            });
        const barchart = (
            <ResponsiveContainer width="90%" height="80%" minHeight={100 * people.length}>
                <ComposedChart width={360} height={480} data={data} layout="vertical">
                    <YAxis yAxisId={0} width={120} type="category" dataKey="name" tick={{fontSize: 32}} orientation="left"   />
                    <YAxis yAxisId={1} width={160} type="category" dataKey="dissent" tick={{fontSize: 32}} orientation="right" tickLine={false} axisLine={false} />
                    <XAxis type="number" />
                    <Bar dataKey="cents">
                        {
                            people.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index + 1]} />
                            ))
                        }
                    </Bar>
                    <Scatter shape="circle" dataKey="needs_upper" fill="#00FF00" />
                    <Scatter shape="circle" dataKey="needs_lower" fill="#FF0000" />
                    <Scatter shape="cross" dataKey="upper_25" fill="#000000" />
                    <Scatter shape="cross" dataKey="lower_25" fill="#000000" />
                </ComposedChart>
            </ResponsiveContainer>
        );

        return (
            <div style={{margin:15+'px'}}>
                <h1>Admin View Page</h1>
                <h2>{roomName}</h2>
                <h2>Room Code: {roomCode}</h2>
                <h2>Total Amount: ${totalAmountDollars}</h2>
                <div style={{
                    display: 'flex',
                    flexFlow: 'column',
                    height: '100%'
                }}>
                    {barchart}
                </div>
            </div>
        );
    }
}

export default AdminView
