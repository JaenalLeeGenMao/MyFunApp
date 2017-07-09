var React = require('react');

class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text
        }
    }

    componentDidMount() {
        var counter = this.state.text + '...';

        this.interval = window.setInterval(function() {
            if (this.state.text === counter) {
                this.setState(function() {
                    return {
                        text: this.props.text
                    }
                });
            } else {
                this.setState(function(previousState) {
                    return {
                        text: previousState.text + '.'
                    }
                });
            }
        }.bind(this), 300);
    }

    componentWillUnmount () {
        window.clearInterval(this.interval);
    }

    render () {
        return (
            <div style={{textAlign: 'center'}}>{this.state.text}</div>
        )
    }
}

Loading.defaultProps = {
    text: 'Loading'
}

module.exports = Loading;
