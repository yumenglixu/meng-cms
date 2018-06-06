import React, { Component } from 'react';
export default class Loading extends Component {
    constructor(props){
  	    super(props);
  	    this.state = {
            show: this.props.show,
            message: this.props.message
  	    }
        if (this.props.disableOffset) {
            this.offsetStyle = {
                marginTop: 0
            }
        }
        else {
            this.offsetStyle = {
                marginTop: 80
            }
        }
    }
    componentWillReceiveProps(nextProps){
  	    this.setState({
            show: nextProps.show,
            message: nextProps.message
  	    })
    }
    render() {
  	    if(!this.state.show) return null;
        return (
            <div className="text-center loading-view" style={this.offsetStyle}>
                <div className="loading">  
                    <span></span>  
                    <span></span>  
                    <span></span>  
                    <span></span>  
                    <span></span>  
                </div>  
                {this.state.message && (
                    <div className="msg">{this.state.message}</div>
                )}
            </div>
        );
    }
}
