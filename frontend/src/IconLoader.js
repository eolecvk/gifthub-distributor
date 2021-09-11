import React from 'react';
import Icons from './icons.svg';
import PropTypes from 'prop-types';

const IconLoader = ({ name, color, size }) => (
    <svg className={`icon icon-${name}`} fill={color} width={size} height={size}>
        <use xlinkHref={`${Icons}#icon-${name}`} />
    </svg>
);

IconLoader.propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
    size: PropTypes.number,
};

export default IconLoader;
