import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import ParticipantViewSwitch from './ParticipantView/ParticipantViewSwitch';
import ObserverView from './ObserverView/ObserverView';
import Home from './Home/Home';
import Header from './Header';

function App() {
    const styleContent = {
        marginTop: '50px',
        marginBottom: '25px',
        padding: '25px',
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
                            <Route
                                path="/participant"
                                exact
                                component={() => <ParticipantViewSwitch />}
                            />
                            <Route path="/observer" exact component={() => <ObserverView />} />
                        </Switch>
                    </div>
                </div>
            </Router>
        </div>
    );
}

export default App;
