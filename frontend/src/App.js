import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import ParticipantViewSwitch from './ParticipantView/ParticipantViewSwitch';
import Home from './Home/Home';

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
                    <div style={styleContent}>
                        <Switch>
                            <Route path="/" exact component={() => <Home />} />
                            <Route
                                path="/:roomCode"
                                exact
                                component={(config) => (
                                    <ParticipantViewSwitch match={config.match} />
                                )}
                            />
                            <Route
                                path="/:roomCode/:path"
                                exact
                                component={(config) => (
                                    <ParticipantViewSwitch match={config.match} />
                                )}
                            />
                        </Switch>
                    </div>
                </div>
            </Router>
        </div>
    );
}

export default App;
