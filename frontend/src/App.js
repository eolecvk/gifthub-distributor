import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import ParticipantViewSwitch from './ParticipantView/ParticipantViewSwitch';
import Home from './Home/Home';
import Admin from './Admin/Admin';

function App() {
    const styleContent = {
        padding: '15px',
    };

    return (
        <div className="App">
            <Router>
                <div>
                    <div style={styleContent}>
                        <Switch>
                            <Route path="/" exact component={() => <Home />} />
                            <Route
                                path="/:roomCode/admin"
                                exact
                                component={(config) => <Admin match={config.match} />}
                            />
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
