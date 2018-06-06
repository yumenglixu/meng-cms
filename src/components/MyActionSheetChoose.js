import React, { Component } from 'react';
import {extendObservable} from "mobx";
import Service from '../config/service';
import config from '../config/config';
import Loading from './Loading';
export default class MyActionSheet extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible: this.props.visible,
            data: this.props.data || [],
            key: this.props.index,
            top: this.props.top || 50,
            left: this.props.left || 0
        }
    }

    componentWillReceiveProps(props){
        this.setState({
            visible: props.visible,
            data: props.data || [],
            key: props.index,
            top: props.top || 50,
            left: props.left || 0
        });
    }
    render() {
        return (
            this.state.visible ?  
                <div className={"setting-body setting-body-channel " + (this.state.visible && "show")} style={{top: this.state.top, left: this.state.left}}>
                    <ul className="mod_address_slide_list_2">
                        {this.state.data.length > 0 && this.state.data.map((val, key) => {
                            return (
                                <li key={key} className={val.key == this.state.key && 'active'} onClick={() => {
                                    if(this.props.maskClosable){
                                        this.setState({
                                            visible: false
                                        });
                                        if (this.state.key == val.key) {
                                            this.props.onClose && this.props.onClose();
                                        }
                                        else {
                                            this.props.onChange && this.props.onChange(val);
                                        }
                                    }
                                }}>{val.name}</li>
                            )
                        })}
                    </ul>
                </div>
            : null 
        );
    }
}