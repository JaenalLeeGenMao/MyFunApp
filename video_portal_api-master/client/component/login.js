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
            loading: false,
            match: false,
            users: []
        };
        //Bind methods so it is declared before using it to prevent "undefined" error
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        Axios.get('http://localhost:3000/user/auth').then(function(res) {
            this.setState(function() {
                return {
                    users: res.data
                }
            });
            console.log(this.state.users);
        }.bind(this));
    }
    //handle input change of the username
    handleUsername(event) {
        var value = event.target.value;
        this.setState(function() {
            return {
                username: value
            }
        });
    }
    //handle input change of the password
    handlePassword(event) {
        var value = event.target.value;
        this.setState(function() {
            return {
                password: value
            }
        });
    }
    //function that handles the form when sign in button is clicked
    handleSubmit(event) {
        // prevent default action. in this case, action is the form submission event
        event.preventDefault();

        this.setState(function() {
            return {
                loading: true,
                username: this.state.username,
                password: this.state.password
            }
        });
        // create a string for an HTTP body message
        var username = this.state.username;
        var password = this.state.password;
        var existingUser = this.state.users;
        var match = this.state.match;
        // {
        //     existingUser.map(function(user) {
        //         if(user.username === username && user.password === password) {
        //             this.setState(function() {
        //                 return {
        //                     loading: false,
        //                     match: true
        //                 }
        //             });
        //         };
        //     }.bind(this));
        // }
        Axios.post('http://localhost:3000/user/auth').then(function(res) {
            console.log(res.data);
        });
    }

    proceed(event) {
        console.log("You've successfully signed in");
    }

    //Rendering the login form
    render() {
        return (
            <div className="center-middle">
                <form className="login-card">
                    <h3 className="text-white">Login</h3>
                    <input value={this.state.username} onChange={this.handleUsername} className="form-control" type="text" placeholder="Username" /><br/>
                    <input value={this.state.password} onChange={this.handlePassword} className="form-control" type="password" placeholder="Password" /><br/>
                    <Link to="/home" onClick={this.state.match === false ? this.handleSubmit:this.proceed} disabled={this.state.loading} className="button">
                        {this.state.loading === false?"Sign in":<Loading/>}
                    </Link>
                </form>
            </div>
        )
    }
}

module.exports = Login;
