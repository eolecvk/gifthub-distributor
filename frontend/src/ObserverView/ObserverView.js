import React, { Component } from 'react';
import {
    ComposedChart,
    XAxis,
    YAxis,
    Bar,
    LabelList,
    ResponsiveContainer,
    Scatter,
    Rectangle,
    Tooltip,
} from 'recharts';
import axios from 'axios';
import ViolinBarLine from './ViolinBarLine';
import CustomNameLabel from './CustomNameLabel';
import * as d3 from 'd3';
import RoomInfo from '../RoomInfo';
import getColor from './../ParticipantView/colors';
import { formatAsUSD } from '../utils';
import AmountDistributedProgressBar from '../ParticipantView/AmountDistributedProgressBar';

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
            <Rectangle x={props.x} y={props.y - 25} width={5} height={60} radius={3} fill={color} />
        );
    }

    getStableMax(recipients) {
        const maxNumber = d3.max(
            recipients
                .map((p) =>
                    [p.needs_upper_bound_cents, p.needs_lower_bound_cents].concat(
                        Object.values(p.votes_cents)
                    )
                )
                .flat()
        );
        let orderOfMagnitude = Math.floor(Math.log10(maxNumber));
        let appliedOrder = Math.pow(10, orderOfMagnitude);
        if (maxNumber / appliedOrder < 4) {
            orderOfMagnitude--;
            appliedOrder = Math.pow(10, orderOfMagnitude);
        }
        return appliedOrder * Math.floor(maxNumber / appliedOrder) + 2 * appliedOrder;
    }

    makeTooltip(props, maxVote) {
        if (props.payload.length == 0) {
            return <div />;
        }
        const attributedVotes = props.payload[0].payload.attributed_votes;
        const hoverValue =
            ((props.coordinate.x - props.viewBox.left) / props.viewBox.width) * maxVote;
        const rangeDivider = maxVote / 30;
        const range = [hoverValue - rangeDivider, hoverValue + rangeDivider];

        const labels = Object.entries(attributedVotes)
            .filter((entry) => range[0] < entry[1] && entry[1] < range[1])
            .sort((entryA, entryB) => entryA[1] - entryB[1])
            .map((entry, index) => (
                <p key={index}>
                    <b>{entry[0]}:</b> {formatAsUSD(entry[1] / 100.0)}
                </p>
            ));
        if (labels.length == 0) {
            return <div />;
        }

        return (
            <div
                style={{
                    margin: '0px',
                    padding: '5px',
                    backgroundColor: 'rgb(255,255,255)',
                    border: '1px solid rgb(204,204,204)',
                    whiteSpace: 'nowrap',
                }}
            >
                {labels}
            </div>
        );
    }

    highResHistogram(data, ticks, domain) {
        const histogram = [];
        for (let i = 0; i < ticks; i++) {
            histogram.push([0]);
            histogram[i].x0 = Math.floor((domain * i) / ticks);
            histogram[i].x1 = Math.floor((domain * (i + 1)) / ticks);
        }
        for (let d = 0; d < data.length; d++) {
            const point = data[d];
            var adjustedPoint = Math.floor((point * ticks) / domain);
            histogram[adjustedPoint][0] += 5;

            if (adjustedPoint > 0) {
                histogram[adjustedPoint - 1][0] += 3;
            }
            if (adjustedPoint < ticks - 1) {
                histogram[adjustedPoint + 1][0] += 3;
            }
            if (adjustedPoint > 1) {
                histogram[adjustedPoint - 2][0] += 1;
            }
            if (adjustedPoint < ticks - 2) {
                histogram[adjustedPoint + 2][0] += 1;
            }
            if (adjustedPoint > 2) {
                histogram[adjustedPoint - 3][0] += 0;
            }
            if (adjustedPoint < ticks - 3) {
                histogram[adjustedPoint + 3][0] += 0;
            }
        }
        return histogram;
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
        const maxVote = this.getStableMax(recipients);
        const totalAmountDollars = this.state.splitting_cents / 100;
        const roomCode = this.state.room_code;
        const roomName = this.state.room_name;
        const voterNamesByVoterId = Object.fromEntries(
            this.state.voters.map((voter) => [voter.voter_id, voter.name])
        );

        const histogramsByRecipientId = Object.fromEntries(
            recipients.map((recipient) => {
                return [
                    recipient.recipient_id,
                    this.highResHistogram(Object.values(recipient.votes_cents), 200, maxVote),
                ];
            })
        );

        const maxHeight = Math.max(...Object.values(histogramsByRecipientId).flat());

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

                const dissentUpNames = Object.entries(p.emotive)
                    .filter((entry) => entry[1] === 'DISSENT_UP')
                    .map((entry) => voterNamesByVoterId[entry[0]]);
                const dissentDownNames = Object.entries(p.emotive)
                    .filter((entry) => entry[1] === 'DISSENT_DOWN')
                    .map((entry) => voterNamesByVoterId[entry[0]]);

                const nameAmtAndDissent = {
                    name: name,
                    amt: formatAsUSD(avg),
                    dissentUpNames: dissentUpNames,
                    dissentDownNames: dissentDownNames,
                };
                return {
                    name_amt_and_dissent: nameAmtAndDissent,
                    x_domain: [0, maxVote],
                    max_height: maxHeight,
                    histogram: histogramsByRecipientId[p.recipient_id],
                    max_vote: maxVote / 100,
                    votes_cents: Object.values(p.votes_cents),
                    attributed_votes: attributedVotes,
                    avg: avg,
                    bar_fill: getColor(index + 1),
                    needs_upper: needs_upper,
                    needs_lower: needs_lower,
                    empty: '',
                };
            });

        const totalDistributed = recipientData.map((p) => p.avg).reduce((p1, p2) => p1 + p2, 0);

        const barchart = (
            <ResponsiveContainer width="95%" height="80%" minHeight={60 * recipients.length}>
                <ComposedChart width={720} height={480} data={recipientData} layout="vertical">
                    <YAxis
                        yAxisId={0}
                        width={200}
                        type="category"
                        dataKey="empty"
                        tick={{ fontSize: 20 }}
                        orientation="left"
                        tickLine={false}
                    />
                    <XAxis
                        type="number"
                        axisLine={false}
                        domain={[0, maxVote / 100]}
                        tickFormatter={(tick) => formatAsUSD(tick)}
                    />
                    /* If isAnimationActive is set to false on the bar chart, it seems to fully fix
                    the missing LabelList issue:
                    https://github.com/recharts/recharts/issues/1664#issuecomment-770315614
                    https://github.com/recharts/recharts/issues/829 */
                    <Bar
                        dataKey="max_vote"
                        label={false}
                        shape={<ViolinBarLine />}
                        isAnimationActive={false}
                    >
                        <LabelList dataKey="name_amt_and_dissent" content={<CustomNameLabel />} />
                    </Bar>
                    <Scatter
                        shape={(props) => this.makeRectangleBar('#00FF00', props)}
                        dataKey="needs_upper"
                    />
                    <Scatter
                        shape={(props) => this.makeRectangleBar('#FF0000', props)}
                        dataKey="needs_lower"
                    />
                    <Scatter shape="cross" dataKey="avg" />
                    <Tooltip content={(props) => this.makeTooltip(props, maxVote)} />
                </ComposedChart>
            </ResponsiveContainer>
        );

        return (
            <div>
                <RoomInfo roomInfo={this.state} />
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
