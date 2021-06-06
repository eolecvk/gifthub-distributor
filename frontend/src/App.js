import React, { Component } from 'react'
import InputPage from "./InputPage"
import AdminView from "./AdminView"
import Home from "./Home"
import Nav from "./Nav"
import {
    BrowserRouter as Router,
    Switch,
    Link,
    Route,
} from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>Pile O' Money</h1>
                <Router>
                    <Nav />
                    <Switch>
                        <Route path="/" exact component={() => <Home />} />
                        <Route path="/input-page" exact component={() => <InputPage />} />
                        <Route path="/admin-view" exact component={() => <AdminView />} />
                    </Switch>
                </Router>
            </div>
        )
    }
}
export default App;