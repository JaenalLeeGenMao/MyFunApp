var React = require('react');
var Loading = require('./loading');
var Link = require('react-router-dom').Link;
var Axios = require('axios');

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            sessionId: '',
            loading: false,
            match: false,
            usernameError: null,
            passwordError: null,
            interval: {}
            // users: []
        };
        //Bind methods so it is declared before using it to prevent "undefined" error
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.proceed = this.proceed.bind(this);
        this.redirectToHome = this.redirectToHome.bind(this);
    }

    //handle input change of the username
    handleUsername(event) {
        var value = event.target.value;
        if (value.length <= 0) {
            this.setState(function() {
                return {
                    username: value,
                    usernameError : 'This field is required'
                }
            });
        }
        else {
            this.setState(function() {
                return {
                    username: value,
                    usernameError : null
                }
            });
        }
    }
    //handle input change of the password
    handlePassword(event) {
        var value = event.target.value;
        if (value.length <= 0) {
            this.setState(function() {
                return {
                    password: value,
                    passwordError : 'This field is required'
                }
            });
        }
        else {
            this.setState(function() {
                return {
                    password: value,
                    passwordError : null
                }
            });
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        //clear the interval so it does not interfere the application
        window.clearInterval(this.state.interval);
    }

    //function that handles the form when sign in button is clicked
    handleSubmit(event) {

        // create a string for an HTTP body message
        var username = this.state.username;
        var password = this.state.password;

        // promt the user if the username field is not filled
        if ( username.length === 0 ) {
            this.setState(function() {
                return {
                    loading: false,
                    usernameError: 'This field is required'
                }
            });
        }

        // promt the user if the password field is not filled
        if ( password.length === 0 ) {
            this.setState(function() {
                return {
                    loading: false,
                    passwordError: 'This field is required'
                }
            });
        }
        // prompt the user if the password entered less than 8 characters
        else if ( password.length < 8 ) {
            this.setState(function() {
                return {
                    loading: false,
                    passwordError: 'Password must be at least 8 characters'
                }
            });
        }

        // Verify that all inputs are entered correctly
        // Send requests to the server, verify the user exist
        if ( username.length && password.length) {

            // Using axios sending requsts to fetch data like AJAX
            Axios.post('http://localhost:3000/user/auth', {username: username, password: password}).then(function(res) {
                console.log("post method");
                console.log(res.data);
                // Id the request success and user exist in DB then do this
                if (res.data.status === "success") {
                    this.setState(function() {
                        return {
                            loading: false,
                            username: res.data.username,
                            sessionId: res.data.sessionId.toString(),
                            match: true,
                            usernameError: null,
                            passwordError: null
                        }
                    });
                    console.log(this.state.sessionId);
                    this.props.history.push('/about?username=' + username + '&sessionId=' + this.state.sessionId);
                }
                // Id the request error and user does NOT exist in DB then do this
                else {
                    this.setState(function() {
                        return {
                            loading: false,
                            match: false,
                            usernameError: 'Username or Password is incorrect',
                            passwordError: null
                        }
                    });
                }

            }.bind(this));
        }
    }

    // Handle the loading button when user clicked the button
    proceed(event) {

        // prevent default action. in this case, action is the form submission event
        event.preventDefault();

        // Initilizing the lazy loading animation
        // Show an initial loader.
        console.log("Loading...");
        this.setState({ loading: true});
        setTimeout(this.handleSubmit, 3000);
    }

    redirectToHome(event) {
        console.log('Welcome, ' + this.state.username);
    }

    //Rendering the login form
    render() {
        var username = this.state.username;
        var password = this.state.password;
        var usernameError = this.state.usernameError;
        var passwordError = this.state.passwordError;
        return (
            <div className="center-middle">
                <form className="login-card">
                    <h3 className="text-white">Login</h3>
                    <div className="text-warning pull-left">{this.state.usernameError}</div>
                    <input value={username} onChange={this.handleUsername} className="form-control" type="text" placeholder="Username" style={usernameError === null ? {"border": "none"}:{"border": "2px solid #d0021b" }}/><br/>
                    <div className="text-warning pull-left">{this.state.passwordError}</div>
                    <input value={password} onChange={this.handlePassword} className="form-control" type="password" placeholder="Password" style={passwordError === null ? {"border": "none"}:{"border": "2px solid #d0021b" }}/><br/>
                    <Link to="/about" onClick={this.state.match ? this.redirectToHome:this.proceed} disabled={this.state.loading} className="button">
                        {this.state.loading === false?"Sign in":<Loading/>}
                    </Link>
                </form>
            </div>
        )
    }
}

module.exports = Login;
