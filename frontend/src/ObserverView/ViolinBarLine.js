import React from 'react';
import * as d3 from 'd3';

const ViolinBarLine = (props) => {
    var data = props.votes_cents;

    var x = d3.scaleLinear().domain(props.x_domain).range([0, props.width]);

    var binnedValues = props.histogram;

    var maxY = props.max_height;

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

export default ViolinBarLine;
