import axios from 'axios';

function formatAsUSD(inputValue) {
    const formatterOptions = {
        style: 'currency',
        currency: 'USD',
        // These options are needed to round to whole numbers if that's what you want.
        // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    };

    const currencyFormatter = new Intl.NumberFormat('en-US', formatterOptions);
    return currencyFormatter.format(inputValue);
}

function refreshCachedRoomInfo(roomCode) {
    axios.get('/api/' + roomCode).then((response) => {
        sessionStorage.setItem('roomInfo', JSON.stringify(response.data));
    });
}

export { formatAsUSD, refreshCachedRoomInfo };
