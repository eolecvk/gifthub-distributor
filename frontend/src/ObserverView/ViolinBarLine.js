import React from 'react';
import * as d3 from 'd3';

const ViolinBarLine = (props) => {
    var data = props.votes_cents;

    var x = d3.scaleLinear().domain(props.x_domain).range([0, props.width]);

    var histogram = d3
        .histogram()
        .domain(x.domain())
        .thresholds(x.ticks(30))
        .value((d) => d);

    var binnedValues = histogram(data);

    var maxY = d3.max(binnedValues.map((bin) => bin.length));

    var heightScale = d3.scaleLinear().range([0, props.height]).domain([-maxY, maxY]);

    var violin = d3
        .area()
        .x(function (d) {
            return x(d.x0) + props.x;
        })
        .y0(function (d) {
            return heightScale(-d.length) + props.y;
        })
        .y1(function (d) {
            return heightScale(d.length) + props.y;
        })
        .curve(d3.curveMonotoneX);

    return <path d={violin(binnedValues)} stroke="none" fill={props.bar_fill} />;
};

export default ViolinBarLine;
