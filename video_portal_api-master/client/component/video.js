var React = require('react');
var queryString = require('query-string');
var Nav = require('./nav');
var Loading = require('./loading');
var Axios = require('axios');
var VideoPlayer = require('react-html5video').DefaultPlayer;
var StarRating = require('react-star-rating-component');
require('react-html5video/dist/styles.css');

// // Displaying videos and pass loading attribute
// function Display(props) {
//     // console.log(props);
//     return (
//         <div className="home-container">
//             <h1>Hello, These are The Videos</h1>
//             <DisplayVideos videos={props.videos} loading={props.loading} onStarClick={props.onStarClick} videoId={props.videoId}/>
//         </div>
//     )
// }
//
// // Load videos onto the screen so user can start watching
// function DisplayVideos(props) {
//     return (
//         <ul className="video-list unstyled">
//             {
//                 props.videos.map(function(video, index) {
//                     return (
//                         <li key={index}>
//                             <VideoPlayer className="video-item"
//                                controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
//                                onCanPlayThrough={() => {
//                                    // Do stuff
//                                 //    props.handleVideo();
//                                }}>
//                                <source src={'http://localhost:3000/' + video.url} type="video/mp4" />
//                                <track label="English" kind="subtitles" srcLang="en" src="http://source.vtt" default />
//                            </VideoPlayer>
//                            <StarRating name={index.toString()} value={props.rating}
//                                 onStarClick={props.onStarClick(video._id)} /><br/>
//                            <label className="video-label text-tomato">{video.name}</label>
//                            {props.loading && <Loading/>}
//                         </li>
//                     )
//                 })
//             }
//         </ul>
//     )
// }

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
            loading: true,
            videoId: '',
            rating: 0
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.handleLoader = this.handleLoader.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        // this.onStarClick = this.onStarClick.bind(this);
        this.handleVideoRequest = this.handleVideoRequest.bind(this)
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
                loading: true,
                videoId: "",
                rating: 0
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
        //Sending request to server to get single video
        // app.get('/video', helperFunctions.isAuthenticated, videos.getOne);
        // Axios.get('http://localhost:3000/video?sessionId=' + this.state.sessionId + '&videoId=5961f02a2ff3e43b9c67f452').then(function(res) {
        //     console.log(res);
        // });
        //Sending request to server to authorize the video rating
        // app.post('/video/ratings', helperFunctions.isAuthenticated, videos.rate);
        // Axios.post('http://localhost:3000/video/ratings?sessionId=' + this.state.sessionId, {videoId:"5961f02a2ff3e43b9c67f452",rating:5}).then(function(res) {
        //     console.log(res);
        // });
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
        setTimeout(this.handleLoader,5000);
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
            // combine the previous data with new data
            videos =  videos.concat(newData)
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
            setTimeout(this.handleVideoRequest, 3000);
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

    // handling rating request
    onStarClick(nextValue, prevValue, name) {
        // Axios.get('http://localhost:3000/video?sessionId=' + this.state.sessionId + '&videoId=5961f02a2ff3e43b9c67f452').then(function(res) {
        //     console.log(res);
        // });
        //
        Axios.post('http://localhost:3000/video/ratings?sessionId=' + this.state.sessionId, {videoId: name,rating: nextValue}).then(function(res) {
            console.log(res);
            this.setState(function() {
                console.log(nextValue);
                console.log(prevValue);
                console.log(name);
                return {
                    videoId: name,
                    rating: nextValue
                }
            });
        }.bind(this));
        // { !this.state.logout ? <Display rating={this.state.rating} onStarClick={this.onStarClick} videoId={this.state.videoId} text={this.state.message} loading={this.state.loading} videos={this.state.videos} handleVideo={this.handleVideo}/> : <LogoutScreen /> }
    }

    render() {
        return (
            <div>
                <Nav handleLogout={this.handleLogout} url={this.props.match.url} username={this.state.username} sessionId={this.state.sessionId} />
                <div className="top-middle" style={{"border": "1px solid #F8F9FD"}} ></div>

                { !this.state.logout ?
                    <ul className="video-list unstyled">
                        {
                            this.state.videos.map(function(video, index) {
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
                                       <StarRating name={video._id}
                                            onStarClick={this.onStarClick.bind(this)} /><br/>
                                       <label className="video-label text-tomato">{video.name}</label>
                                    </li>
                                )
                            }.bind(this))
                        }
                    </ul>
                    : <LogoutScreen /> }
                    {this.state.loading && <Loading/>}
            </div>
        )
    }
}

module.exports = Video;
