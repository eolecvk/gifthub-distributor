import React, { Component } from 'react';

const GHContext = React.createContext();
const GHProvider = TodosContext.Provider;
// const GHConsumer = GHContext.Consumer

class MyContext extends Component {
    render() {
        const contextValueIni = {
            roomInfo: {},
            sliderGridState: {},
        };

        return <GHProvider value={contextValueIni}>{this.props.children}</GHProvider>;
    }
}

export { GHContext, MyContext };
