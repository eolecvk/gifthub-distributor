import React, { Component } from 'react';
import { ComposedChart, XAxis, YAxis, Bar, Cell, LabelList, ResponsiveContainer, Scatter } from 'recharts';
import axios from 'axios'
import { quantile } from "./utils"
import colors from './../ParticipantView/colors'
import AmountDistributedProgressBar from '../ParticipantView/AmountDistributedProgressBar';

// Example: https://blog.stvmlbrn.com/2019/02/20/automatically-refreshing-data-in-react.html
class ObserverView extends Component {

    constructor() {
        super()
        this.state = JSON.parse(sessionStorage.getItem("roomInfo")) || '';
    }

    intervalID;

    componentDidMount() {
        document.title = 'Observer';
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
                const dissent = `👇${countDissentDown}  👆${countDissentUp}`
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

        const totalDistributed = (data.length > 0) ?
            data.map((p) => p.cents).reduce((p1, p2) => p1 + p2) :
            0


        const barchart = (
            <ResponsiveContainer width="95%" height="80%" minHeight={100 * people.length}>
                <ComposedChart width={720} height={480} data={data} layout="vertical">
                    <YAxis yAxisId={0} width={100} type="category" dataKey="name" tick={{ fontSize: 20 }} orientation="left" tickLine={false} />
                    <YAxis yAxisId={1} width={100} type="category" dataKey="dissent" tick={{ fontSize: 20 }} orientation="right" tickLine={false} axisLine={false} />
                    <XAxis type="number" axisLine={false} />
                    <Bar dataKey="cents" label={true}>
                        <LabelList dataKey="cents" position="insideLeft" style={{ fontSize:20, fill: "white" }} />
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
            <div style={{ marginLeft: 50 + 'px' }} >
                <h1 style={{ textAlign: "center" }} textAlign>{roomName} [{roomCode}]</h1>
                <AmountDistributedProgressBar
                    amountDistributed={totalDistributed}
                    amountTotal={totalAmountDollars}
                />
                <div style={{
                    marginTop: 50 + 'px',
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

export default ObserverView
