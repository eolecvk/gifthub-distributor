import React from 'react';
import * as d3 from 'd3';

const ViolinBarLine = (props) => {
    const svgRef = React.useRef(null);
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll('*').remove();
    svgEl.append('g');

    var data = props.votes_cents;

    var x = d3.scaleLinear().domain(props.x_domain).range([0, props.width]);

    var histogram = d3
        .histogram()
        .domain(x.domain())
        .thresholds(x.ticks(30))
        .value((d) => d);

    var binnedValues = histogram(data);

    var maxY = Math.max(...binnedValues.map((bin) => bin.length));

    var heightScale = d3.scaleLinear().range([0, props.height]).domain([-maxY, maxY]);

    svgEl
        .selectAll('.g')
        .data([binnedValues])
        .enter()
        .append('path')
        .style('stroke', 'none')
        .style('fill', props.bar_fill)
        .attr(
            'd',
            d3
                .area()
                .x(function (d) {
                    return x(d.x0);
                })
                .y0(function (d) {
                    return heightScale(-d.length);
                })
                .y1(function (d) {
                    return heightScale(d.length);
                })
                .curve(d3.curveCatmullRom) // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
        );

    return <svg ref={svgRef} width={props.width} height={props.height} x={props.x} y={props.y} />;
};

export default ViolinBarLine;
