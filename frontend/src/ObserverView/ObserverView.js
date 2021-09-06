import React, { Component } from 'react';
import {
    ComposedChart,
    XAxis,
    YAxis,
    Bar,
    Cell,
    LabelList,
    ResponsiveContainer,
    Scatter,
    Rectangle,
    Tooltip,
} from 'recharts';
import axios from 'axios';
import ViolinBarLine from './ViolinBarLine';
import { quantile } from './utils';
import colors from './../ParticipantView/colors';
import AmountDistributedProgressBar from '../ParticipantView/AmountDistributedProgressBar';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

class ObserverView extends Component {
    constructor() {
        super();
        this.state = JSON.parse(sessionStorage.getItem('roomInfo')) || '';
    }

    intervalID;

    componentDidMount() {
        document.title = 'Observer';
        this.getData();
    }

    componentWillUnmount() {
        clearTimeout(this.intervalID);
    }

    makeRectangleBar(color, props) {
        return (
            <Rectangle
                x={props.x}
                y={props.y - 25}
                width={10}
                height={60}
                radius={3}
                fill={color}
            />
        );
    }

    makeTooltip(props, maxVote) {
        if (props.payload.length == 0) {
            return <div className="custom-tooltip" />;
        }
        const attributedVotes = props.payload[0].payload.attributed_votes;
        const hoverValue =
            ((props.coordinate.x - props.viewBox.left) / props.viewBox.width) * maxVote;
        const rangeDivider = maxVote / 40;
        const range = [hoverValue - rangeDivider, hoverValue + rangeDivider];

        const labels = Object.entries(attributedVotes)
            .filter((entry) => range[0] < entry[1] && entry[1] < range[1])
            .sort((entryA, entryB) => entryA[1] - entryB[1])
            .map((entry, index) => (
                <p key={index}>
                    {entry[0]}: {currencyFormatter.format(entry[1] / 100.0)}
                </p>
            ));

        return <div className="custom-tooltip">{labels}</div>;
    }

    getData = () => {
        axios
            .get('/api/' + this.state.room_code)
            .then((response) => {
                this.setState({ recipients: response.data.recipients });
                // call getData() again in 5 seconds
                this.intervalID = setTimeout(this.getData.bind(this), 1000);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        const recipients = this.state.recipients;
        const maxVote = Math.max(...recipients.map((p) => Object.values(p.votes_cents)).flat());
        const totalAmountDollars = this.state.splitting_cents / 100;
        const roomCode = this.state.room_code;
        const roomName = this.state.room_name;
        const voterNamesByVoterId = Object.fromEntries(
            this.state.voters.map((voter) => [voter.voter_id, voter.name])
        );

        const recipientData = recipients
            .sort((p1, p2) => p1.recipient_id - p2.recipient_id)
            .map((p, index) => {
                const name = p.name;
                const avg = p.avg_cents / 100;
                const needs_upper = p.needs_upper_bound_cents / 100;
                const needs_lower = p.needs_lower_bound_cents / 100;
                const attributedVotes = Object.fromEntries(
                    Object.entries(p.votes_cents).map((entry) => [
                        voterNamesByVoterId[entry[0]],
                        entry[1],
                    ])
                );

                const countDissentUp = Object.entries(p.emotive).filter(
                    (entry) => entry[1] === 'DISSENT_UP'
                ).length;
                const countDissentDown = Object.entries(p.emotive).filter(
                    (entry) => entry[1] === 'DISSENT_DOWN'
                ).length;
                const dissent = `👇${countDissentDown}  👆${countDissentUp}`;
                return {
                    name: name,
                    dissent: dissent,
                    x_domain: [0, maxVote],
                    max_vote: maxVote / 100,
                    votes_cents: Object.values(p.votes_cents),
                    attributed_votes: attributedVotes,
                    avg: avg,
                    bar_fill: colors[index + 1],
                    domain: [0, 8000],
                    needs_upper: needs_upper,
                    needs_lower: needs_lower,
                };
            });

        const totalDistributed =
            recipientData.length > 0
                ? recipientData.map((p) => p.avg).reduce((p1, p2) => p1 + p2)
                : 0;

        const barchart = (
            <ResponsiveContainer width="95%" height="80%" minHeight={100 * recipients.length}>
                <ComposedChart width={720} height={480} data={recipientData} layout="vertical">
                    <YAxis
                        yAxisId={0}
                        width={100}
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 20 }}
                        orientation="left"
                        tickLine={false}
                    />
                    <YAxis
                        yAxisId={1}
                        width={100}
                        type="category"
                        dataKey="dissent"
                        tick={{ fontSize: 20 }}
                        orientation="left"
                        tickLine={false}
                        axisLine={false}
                    />
                    <XAxis type="number" axisLine={false} domain={[0, maxVote / 100]} />
                    <Bar dataKey="max_vote" label={false} shape={<ViolinBarLine />}/>
                    <Scatter
                        shape={(props) => this.makeRectangleBar('#00FF00', props)}
                        dataKey="needs_upper"
                    />
                    <Scatter
                        shape={(props) => this.makeRectangleBar('#FF0000', props)}
                        dataKey="needs_lower"
                    />
                    <Scatter shape="circle" dataKey="avg" />
                    <Tooltip content={(props) => this.makeTooltip(props, maxVote)} />
                </ComposedChart>
            </ResponsiveContainer>
        );

        return (
            <div style={{ marginLeft: 50 + 'px' }}>
                <h1 style={{ textalign: 'center' }}>
                    {roomName} [{roomCode}]
                </h1>
                <AmountDistributedProgressBar
                    amountDistributed={totalDistributed}
                    amountTotal={totalAmountDollars}
                />
                <div
                    style={{
                        marginTop: 50 + 'px',
                        display: 'flex',
                        flexFlow: 'column',
                        height: '100%',
                    }}
                >
                    {barchart}
                </div>
            </div>
        );
    }
}

export default ObserverView;
