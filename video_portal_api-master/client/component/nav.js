var React = require('react');
var NavLink = require('react-router-dom').NavLink;
var Link = require('react-router-dom').Link;
var Axios = require('axios');

// function Nav(props) {
//     var username = props.username;
//     var sessionId = props.sessionId;
//     var url = props.url;
//
//     return (
//         <div className="nav">
//             <h2>
//                 <NavLink exact activeClassName="active" to={url + '?username=' + username + '&sessionId=' + sessionId}>CrossOver Video Portal</NavLink>
//             </h2>
//             <ul className="pull-right unstyled list-dropdown">
//                 <li>Welcome, {username}</li>
//                 <li className="blowfish">Logout &#9660;</li>
//                 <li className="dropdown-menu">
//                     <ul className="dropdown-item unstyled">
//                         <li>
//                             <NavLink activeClassName="active" to="/videos"><img className="icon" src="https://image.flaticon.com/icons/svg/26/26025.svg"/>&nbsp;Video</NavLink>
//                         </li>
//                         <li>
//                             <NavLink activeClassName="active" to="/"><img className="icon" src="https://image.flaticon.com/icons/svg/159/159707.svg"/>&nbsp;logout</NavLink>
//                         </li>
//                     </ul>
//                 </li>
//             </ul>
//         </div>
//     )
// }

class Nav extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            sessionId: '',
            url: ''
        };
        this.handleLogout = this.handleLogout.bind(this);
    }

    // set the values before any component UI is being uploaded
    componentWillMount() {
        this.setState(function() {
            return {
                username: this.props.username,
                sessionId: this.props.sessionId,
                url: this.props.url
            }
        });
    }

    // handle the logout button to prevent default execution
    // make get request to be authorized
    handleLogout(event) {
        // app.get('/user/logout', helperFunctions.isAuthenticated, users.logout);
        event.preventDefault();
        var sessionId = this.state.sessionId;
        Axios.get('http://localhost:3000/user/logout?sessionId=' + sessionId).then(function(res) {
            console.log(res.data);
            if (res.data.status === "success") {
                this.props.handleLogout(true);
            }
        }.bind(this));
    }

    render() {
        var username = this.props.username;
        var sessionId = this.props.sessionId;
        var url = this.props.url;

        return (
            <div className="nav">
                <h2>
                    <NavLink exact activeClassName="active" to={url + '?username=' + username + '&sessionId=' + sessionId}>CrossOver Video Portal</NavLink>
                </h2>
                <ul className="pull-right unstyled list-dropdown">
                    <li>Welcome, {username}</li>
                    <li className="blowfish">Logout &#9660;</li>
                    <li className="dropdown-menu">
                        <ul className="dropdown-item unstyled">
                            <li>
                                <NavLink activeClassName="active" to="/videos">
                                    <img className="icon" src="https://image.flaticon.com/icons/svg/26/26025.svg"/>&nbsp;Video
                                </NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="active" to="/" onClick={this.handleLogout}>
                                    <img className="icon" src="https://image.flaticon.com/icons/svg/159/159707.svg"/>&nbsp;logout
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        )
    }
}

module.exports = Nav;
