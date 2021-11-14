import React from 'react';
import * as d3 from 'd3';

const ViolinBarLine = (props) => {
    var data = props.votes_cents;

    var x = d3.scaleLinear().domain(props.x_domain).range([0, props.width]);

    var binnedValues = highResHistogram(data, 200, props.x_domain[1]);

    var maxY = d3.max(binnedValues.map((bin) => bin[0]));

    var heightScale = d3.scaleLinear().range([0, props.height]).domain([-maxY, maxY]);

    var violin = d3
        .area()
        .x(function (d) {
            return x(d.x0) + props.x;
        })
        .y0(function (d) {
            return heightScale(-d[0]) + props.y;
        })
        .y1(function (d) {
            return heightScale(d[0]) + props.y;
        })
        .curve(d3.curveMonotoneX);

    return <path d={violin(binnedValues)} stroke="none" fill={props.bar_fill} />;
};

function highResHistogram(data, ticks, domain) {
    const histogram = [];
    for (let i = 0; i < ticks; i++) {
        histogram.push([0]);
        histogram[i].x0 = Math.floor((domain * i) / ticks);
        histogram[i].x1 = Math.floor((domain * (i + 1)) / ticks);
    }
    for (let d = 0; d < data.length; d++) {
        const point = data[d];
        var adjustedPoint = Math.floor((point * ticks) / domain);
        console.log(adjustedPoint);
        histogram[adjustedPoint][0] += 6;

        if (adjustedPoint > 0) {
            histogram[adjustedPoint - 1][0] += 5;
        }
        if (adjustedPoint < ticks - 1) {
            histogram[adjustedPoint + 1][0] += 5;
        }
        if (adjustedPoint > 1) {
            histogram[adjustedPoint - 2][0] += 3;
        }
        if (adjustedPoint < ticks - 2) {
            histogram[adjustedPoint + 2][0] += 3;
        }
        if (adjustedPoint > 2) {
            histogram[adjustedPoint - 3][0] += 1;
        }
        if (adjustedPoint < ticks - 3) {
            histogram[adjustedPoint + 3][0] += 1;
        }
    }
    return histogram;
}

export default ViolinBarLine;
