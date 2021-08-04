import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import InputPage from './UserView/InputPage';
import AdminView from './AdminView/AdminView';
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
                            <Route path="/input-page" exact component={() => <InputPage />} />
                            <Route path="/admin-view" exact component={() => <AdminView />} />
                        </Switch>
                    </div>
                    <Footer />
                </div>
            </Router>
        </div>
    );
}

export default App;
