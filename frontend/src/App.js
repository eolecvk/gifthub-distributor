import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import ParticipantView from './ParticipantView/ParticipantView';
import ObserverView from './ObserverView/ObserverView';
import Home from './Home/Home';
import Header from './Header';
import Footer from './Footer';

function App() {

    const styleContent = {
        marginTop: '150px',
    };

    return (
        <div className="App">
            <Router>
                <div>
                    <Header />
                    <hr />
                    <div style={styleContent}>
                        <Switch>
                            <Route path="/" exact component={() => <Home />} />
                            <Route path="/participant-view" exact component={() => <ParticipantView />} />
                            <Route path="/observer-view" exact component={() => <ObserverView />} />
                        </Switch>
                    </div>
                    <Footer />
                </div>
            </Router>
        </div>
    );
}

export default App;
