const colors = [
    '#000080',
    '#008080',
    '#800080',
    '#008000',
    '#808000',
    '#800000',
    '#808080',
    '#C0C0C0',
    '#FF00FF',
    '#00FFFF',
    '#FFFF00',
    '#0000FF',
    '#00FF00',
    '#FF0000',
    '#FFFFFF',
    '#000000',
];

function getColor(userIndex) {
    return colors[userIndex % colors.length];
}

export default getColor;
