var React = require('react');
var queryString = require('query-string');
var Nav = require('./nav');
var Loading = require('./loading');
var Axios = require('axios');
var VideoPlayer = require('react-html5video').DefaultPlayer;
require('react-html5video/dist/styles.css');

function Display(props) {
    return (
        <div className="home-container">
            <ul className="video-list unstyled">
                {
                    props.videos.map(function(video) {
                        return (
                            <li className="video-item" key={video._id}>
                                <VideoPlayer loop
                                   controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
                                   onCanPlayThrough={() => {
                                       // Do stuff
                                   }}>
                                   <source src={'http://localhost:3000/' + video.url} type="video/mp4" />
                                   <track label="English" kind="subtitles" srcLang="en" src="http://source.vtt" default />
                               </VideoPlayer>
                               <label>{video.name}</label>
                            </li>
                        )
                    })
                }
            </ul>
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
            videos: []
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

    // sending request after all UI has been rendered
    componentDidMount() {
        Axios.get('http://localhost:3000/videos?sessionId=' + this.state.sessionId + '&skip=0&limit=10').then(function(res) {
            console.log(res.data.data);
            this.setState(function() {
                return {
                    videos : res.data.data
                }
            });
        }.bind(this));
    }

    // clear the interval once UI is destroyed
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

    // method foe playing 1 video at a time
    handleVideo() {
        var videos = document.querySelectorAll('video');
        for(var i=0; i<videos.length; i++)
            videos[i].addEventListener('play', function(){pauseAll(this)}, true);

            function pauseAll(elem){
            	for(var i=0; i<videos.length; i++){
            		//Is this the one we want to play?
            		if(videos[i] == elem) continue;
            		//Have we already played it && is it already paused?
            		if(videos[i].played.length > 0 && !videos[i].paused){
            		// Then pause it now
            		  videos[i].pause();
            	}
            }
        }
    }

    render() {
        return (
            <div>
                <Nav handleLogout={this.handleLogout} url={this.props.match.url} username={this.state.username} sessionId={this.state.sessionId} />
                <div className="top-middle" style={{"border": "1px solid #F8F9FD"}} ></div>
                <Display videos={this.state.videos} />
            </div>
        )
    }
}

module.exports = Video;
