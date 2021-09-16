import axios from 'axios';

function formatAsUSD(inputValue) {
    let formatterOptions;
    // These options are needed to round to whole numbers if that's what you want.
    // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)

    if (inputValue % 1 === 0) {
        // Case: inputValue is a whole number
        formatterOptions = {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        };
    } else {
        formatterOptions = {
            style: 'currency',
            currency: 'USD',
        };
    }

    const currencyFormatter = new Intl.NumberFormat('en-US', formatterOptions);
    return currencyFormatter.format(inputValue);
}

function refreshCachedRoomInfo(roomCode) {
    axios.get('/api/' + roomCode).then((response) => {
        sessionStorage.setItem('roomInfo', JSON.stringify(response.data));
    });
}

export { formatAsUSD, refreshCachedRoomInfo };
