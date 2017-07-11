var React = require('react');
var queryString = require('query-string');
var Nav = require('./nav');
var Loading = require('./loading');
var Axios = require('axios');

// simple screen that displays wumpus in the home page
function HomeScreen(props) {
    return (
        <div className="home-container">
            <h1>Hello There!</h1>
            <p>I am Jaenal from Batam islands, Indonesia.</p>
            <p>I graduated from Monash University Malaysia in July 2016</p>
            <p>This is actually my first time using react to build an app.</p>
            <p>I have been learning React about 2 weeks. While learning I manage to build small Restful API </p>
            <p>Using Node, MongoDB and Express.</p>
            <p>2 Hours left till submittion and I dont think I can finish all the requirements</p>
            <p>I still have a lot to learn on React but I truly hope </p>
            <p>that you consider me to be part of your team </p>
            <p>as frontend engineer</p>
            <p>Incase any file is corrupted, you can visit my <a href="https://github.com/JaenalLeeGenMao/MyFunApp/tree/master/video_portal_api-master">GitHub Account</a> </p>
        </div>
    )
}

// Screen that displays lazy loader when logging out is invoked
function LogoutScreen(props) {
    return (
        <div>
            <Loading text={"Logging out"} />
        </div>
    )
}

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            sessionId: '',
            logout : false
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.handleLoader = this.handleLoader.bind(this);
    }

    // set the values before any component UI is being uploaded
    componentWillMount() {
        var data = this.props.location.search;
        data = queryString.parse(data);

        // console.log(data.username);
        this.setState(function() {
            return {
                username: data.username,
                sessionId: data.sessionId
            }
        });
    }

    componentWillUnmount() {
        //clear the interval so it does not interfere the application
        window.clearInterval(this.state.interval);
    }

    //event that handles the logout request after its been authorized
    handleLogout(logout) {
        // Initilizing the lazy loading animation
        // Show an initial loader.
        console.log("Logging out...");
        this.setState(function() {
            return {
                logout : logout
            }
        });
        setTimeout(this.handleLoader,3000);
    }

    //event that triggers the lazy loader
    handleLoader() {
        console.log("You've Successfully logged out!");
        this.props.history.push('/');
    }

    render() {
        console.log('Welcome, ' + this.state.username + '!');
        return (
            <div>
                <Nav handleLogout={this.handleLogout} url={this.props.match.url} username={this.state.username} sessionId={this.state.sessionId} />
                <div className="top-middle" style={{"border": "1px solid #F8F9FD"}} ></div>
                { !this.state.logout ? <HomeScreen /> : <LogoutScreen /> }
            </div>
        )
    }
}

module.exports = About;
