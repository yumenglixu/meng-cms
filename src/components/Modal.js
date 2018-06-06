import React, { Component } from 'react';
import {ButtonGroup, Button} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';
import {observer} from "mobx-react";
import {extendObservable,observable,autorun} from "mobx";
export default observer(class ModalTalk extends Component {
    constructor(props){
        super(props);
        // 分类
        extendObservable(this, {
            title: this.props.title || '',
            subtitle: this.props.subtitle || '',
            show: this.props.show || false,
            okText: this.props.okText || '确认'
        });

    }
    componentWillReceiveProps(props){
        this.show = props.show || false;
        this.title = props.title || '';
        this.subtitle = props.subtitle || '';
        this.okText = props.okText || '确认';
    }
    render() {
        return (
            <div className={"talk-contaner " + (this.show && "talk-contaner-show")}>
                <div className="overlay_bg"></div>
                <div className="talk-panel animated">
                    <div className="panel-info">
                        <i className="close-login" onClick={() => {
                            this.show = false;
                            this.props.onClose && this.props.onClose();
                        }}>×</i>
                        <div className="panel_tab clearfix">
                            <div className="title">
                                <div className="fl">{this.title}</div>
                                {this.props.subtitle && (
                                    <div className="register_text_tel">{this.props.subtitle}</div>
                                )}
                            </div>
                            <form className="con-panel-main">
                                {this.props.children}
                            </form>
                            <div className="property-buy-action">
                                <button className="input-btn input-btn-white" type="button" onClick={() => {
                                    this.show = false;
                                    this.props.onClose && this.props.onClose();
                                }}>
                                    取消
                                </button>
                                <button className="input-btn input-btn-ghost" type="button" onClick={() => {
                                    {/* this.show = false; */}
                                    this.props.onSubmit && this.props.onSubmit();
                                }}>
                                    {this.okText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});