var React = require('react');
var Login = require('./login');
var ReactRouter = require('react-router-dom');
var Router = ReactRouter.BrowserRouter;
var Route = ReactRouter.Route;
var Switch = ReactRouter.Switch;
var Login = require('./login');
var Home = require('./home');
var Video = require('./video');

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route exact path="/home" component={Home} />
                        <Route exact path="/videos" component={Video} />
                        <Route render={function() {
                            return (
                                    <div className="invalid-container">
                                        <img src='http://i.imgur.com/6bgtvrg.jpg'/>
                                        <code>Page not found</code>
                                    </div>
                            )
                        }} />
                    </Switch>
                </div>
            </Router>
        )
    }
}

module.exports = App;
