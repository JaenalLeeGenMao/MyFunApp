var React = require('react');
var queryString = require('query-string');
var Nav = require('./nav');
var Loading = require('./loading');
var Axios = require('axios');
var VideoPlayer = require('react-html5video').DefaultPlayer;
require('react-html5video/dist/styles.css');

function Display(props) {
    console.log(props);
    return (
        <div className="home-container">
            <h1>Hello, These are The Videos</h1>
            <DisplayVideos videos={props.videos} loading={props.loading}/>
        </div>
    )
}

function DisplayVideos(props) {
    return (
        <ul className="video-list unstyled">
            {
                props.videos.map(function(video, index) {
                    return (
                        <li key={index}>
                            <VideoPlayer className="video-item"
                               controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
                               onCanPlayThrough={() => {
                                   // Do stuff
                                //    props.handleVideo();
                               }}>
                               <source src={'http://localhost:3000/' + video.url} type="video/mp4" />
                               <track label="English" kind="subtitles" srcLang="en" src="http://source.vtt" default />
                           </VideoPlayer>
                           <div className="js-kit-rating"></div>
                           <div className="js-kit-comments"></div>
                           <label className="video-label text-tomato">{video.name}</label>
                           {props.loading && <Loading/>}
                        </li>
                    )
                })
            }
        </ul>
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

class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            sessionId: '',
            logout : false,
            videos: [],
            message: 'not at bottom',
            loading: true
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.handleLoader = this.handleLoader.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        // this.handleVideo = this.handleVideo.bind(this);
    }
    // set the values before any component UI is being uploaded
    componentWillMount() {
        var data = this.props.location.search;
        data = queryString.parse(data);
        // console.log(data.username);
        this.setState(function() {
            return {
                username: data.username,
                sessionId: data.sessionId,
                loading: true
            }
        });
    }

    // sending request after all UI has been rendered
    componentDidMount() {
        // add event listener to dewtect scroll event
        window.addEventListener("scroll", this.handleScroll);
        if (this.state.videos.length === 0) {
            this.handleVideoRequest();
        }
    }

    // clear the interval once UI is destroyed
    componentWillUnmount() {
        // remove scroll event listener
        window.removeEventListener("scroll", this.handleScroll);
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

    //event that triggers the lazy loader when logout
    handleLoader() {
        console.log("You've Successfully logged out!");
        this.props.history.push('/');
    }

    // handle video request via get method 0 skip and limit to 10 video per request
    handleVideoRequest() {
        Axios.get('http://localhost:3000/videos?sessionId=' + this.state.sessionId + '&skip=0&limit=10').then(function(res) {
            var videos =  this.state.videos;
            var newData = res.data.data;
            console.log(newData);
            // combine the previous data with new data
            videos =  videos.concat(newData)
            console.log(videos);
            this.setState(function() {
                return {
                    videos : videos,
                    loading: false
                }
            });
        }.bind(this));
    }

    handleScroll() {
        var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        var body = document.body;
        var html = document.documentElement;
        var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
        var windowBottom = windowHeight + window.pageYOffset;

        if (windowBottom >= docHeight) {
            this.handleVideoRequest();
            this.setState({
                message: 'bottom reached',
                loading: true
            });
        } else {
        this.setState({
            message: 'not at bottom',
            loading: false
        });
        }
    }

    render() {
        return (
            <div>
                <Nav handleLogout={this.handleLogout} url={this.props.match.url} username={this.state.username} sessionId={this.state.sessionId} />
                <div className="top-middle" style={{"border": "1px solid #F8F9FD"}} ></div>
                { !this.state.logout ? <Display text={this.state.message} loading={this.state.loading} videos={this.state.videos} handleVideo={this.handleVideo}/> : <LogoutScreen /> }
            </div>
        )
    }
}

module.exports = Video;
