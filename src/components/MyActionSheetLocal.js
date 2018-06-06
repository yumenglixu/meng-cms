import React, { Component } from 'react';
import {extendObservable} from "mobx";
import Service from '../config/service';
import Loading from './Loading';
export default class MyActionSheet extends Component {
    constructor(props){
        super(props);

        this.state = {
            left: this.props.left || 0,
            top: this.props.top || 0,
            loading: true,
            clear: this.props.clear || false,
            visible: this.props.visible,
            height: this.props.height || '85%',
            classType: this.props.classType || '',
            proviceList: [],
            cityList: [],
            countyList: []
        }

        extendObservable(this, {
            surePid: this.props.pid || 110000,
            sureCid: this.props.cid,
            sureCoutid: this.props.couid,
            pname: this.props.pname || '',
            cname: this.props.cname || '',
            couname: this.props.couname || '',
            deep: this.props.deep || 3
        });
    }

    componentWillReceiveProps(props){
        this.setState({
            left: props.left || 0,
            top: props.top || 0,
            loading: true,
            clear: props.clear || false,
            visible: props.visible,
            height: props.height || '85%',
            classType: props.classType || ''
        });
        this.surePid = props.pid;
        this.sureCid = props.cid;
        this.sureCoutid = props.couid;
        this.pname = props.pname || '';
        this.cname = props.cname || '';
        this.couname = props.couname || '';
        this.deep = props.deep || 3;
        if (props.visible) {
            this.localArea();
        }
    }

    localArea() {
        if (this.sureCoutid && this.sureCoutid >= -1 && this.deep === 3) {
            this.localAreaCount(this.sureCid);
        }
        else if (this.sureCid && this.sureCid >= -1) {
            this.localAreaCity(this.surePid);
        }
        else {
            this.localAreaPro();
        }
    }
    localAreaPro() {
        Service.getArea({
            prevCode: -1
        }).then((res)=>{
            res.body.forEach((obj) => {
                if (obj.addrCode == this.surePid) {
                    this.pname = obj.addrName;
                } 
            });
            this.setState({
                cityList: [],
                countyList: [],
                proviceList: res.body
            });
            setTimeout(() => {
                this.setState({
                    loading: false
                });
            }, 300);
        });
    }
    localAreaCity(pid) {
        Service.getArea({
            prevCode: pid || this.surePid
        }).then((res)=>{
            res.body.forEach((obj) => {
                if (obj.addrCode == this.sureCoutid) {
                    this.cname = obj.addrName;
                } 
            });
            this.setState({
                cityList: res.body
            });
            setTimeout(() => {
                this.setState({
                    loading: false
                });
            }, 300);
        });
    }
    localAreaCount(cid) {
        Service.getArea({
            prevCode: cid || this.sureCid
        }).then((res)=>{
            res.body.unshift({
                addrCode: '-1',
                addrName: '不限'
            });
            res.body.forEach((obj) => {
                if (obj.addrCode == this.sureCoutid) {
                    this.couname = obj.addrName;
                } 
            });
            this.setState({
                countyList: res.body
            });
            setTimeout(() => {
                this.setState({
                    loading: false
                });
            }, 300);
        });
    }
    render() {
        return (
            this.state.visible ?  
                <div className={"setting-body setting-body-channel " + (this.state.visible && "show")} style={{left: this.state.left, top: this.state.top}}>
                    <ul className="mod_address_slide_tabs_1" id="addrNav">
                        {this.pname && (
                            <li  className={this.cname === '' && 'cur'} onClick={() => {
                                this.sureCid = '';
                                this.cname = '';
                                this.sureCoutid = '';
                                this.couname = '';
                                this.setState({
                                    cityList: [],
                                    countyList: []
                                })
                                setTimeout(() => {
                                    this.localAreaPro();
                                }, 0);
                            }}><span>{this.pname}</span></li>
                        )}
                        {this.cname && (
                            <li  className={this.couname === '' && 'cur'} onClick={() => {
                                this.sureCoutid = '';
                                this.couname = '';
                                this.setState({
                                    countyList: []
                                })
                                setTimeout(() => {
                                    this.localAreaCity();
                                }, 0);
                            }}><span>{this.cname}</span></li>
                        )}
                        {this.couname && (
                            <li  className="cur"><span>{this.couname}</span></li>
                        )}
                        {!(this.pname && this.cname && this.couname) && (
                            <li><span>请选择</span></li>
                        )}
                        {this.state.clear && (
                            <div className="sheet-clear" onClick={() => {
                                if (this.surePid || this.sureCid) {
                                    this.props.onClose && this.props.onClose({
                                        pname: '',
                                        pid: '',
                                        cname: '',
                                        cid: '',
                                        couname: '',
                                        couid: '',
                                    });
                                }
                                else {
                                    this.props.onClose && this.props.onClose();
                                }
                            }}>
                                <i className="icon-delete-large"></i>
                                清空选择
                            </div>
                        )}
                    </ul>
                    {this.state.loading ?  <Loading show={this.state.loading}/> : (
                        <ul className="mod_address_slide_list_2">
                            {this.state.countyList.length  > 0 && this.state.countyList.map((val, index) => {
                                return (
                                    <li key={index} value={val.addrCode} className={this.sureCoutid == val.addrCode && "active"} onClick={() => {
                                        if (this.sureCoutid === val.addrCode) {
                                            this.props.onClose && this.props.onClose();
                                        }
                                        else {
                                            this.props.onClose && this.props.onClose({
                                                pname: this.pname,
                                                pid: this.surePid,
                                                cid: this.sureCid,
                                                cname: this.cname,
                                                couname: val.addrName,
                                                couid: val.addrCode
                                            });
                                        }
                                    }}>{val.addrName}</li>
                                )
                            })}

                            {this.state.countyList.length === 0 && this.state.cityList.length  > 0 && this.state.cityList.map((val, index) => {
                                return (
                                    <li key={index} value={val.addrCode} className={this.sureCid == val.addrCode && "active"} onClick={() => {
                                        if (+this.deep === 2) {
                                            if (this.sureCid === val.addrCode) {
                                                this.props.onClose && this.props.onClose();
                                            }
                                            else {
                                                this.props.onClose && this.props.onClose({
                                                    pname: this.pname,
                                                    pid: this.surePid,
                                                    cid: val.addrCode,
                                                    cname: val.addrName
                                                });
                                            }
                                        }
                                        else {
                                            this.sureCid = val.addrCode;
                                            this.cname = val.addrName;
                                            this.sureCoutid = '';
                                            this.couname = '';
                                            setTimeout(() => {
                                                this.localAreaCount(val.addrCode);
                                            }, 0);
                                        }
                                    }}>{val.addrName}</li>
                                )
                            })}
                            {(this.state.cityList.length === 0 && this.state.proviceList.length > 0) && this.state.proviceList.map((val, index) => {
                                return (
                                    <li key={index} value={val.addrCode} className={this.surePid == val.addrCode && "active"} onClick={() => {
                                        this.surePid = val.addrCode;
                                        this.sureCid = '';
                                        this.sureCoutid = '';
                                        this.pname = val.addrName;
                                        this.cname = '';
                                        this.couname = '';
                                        setTimeout(() => {
                                            this.localAreaCity(val.addrCode);
                                        }, 0);
                                    }}>{val.addrName}</li>
                                )
                            })}
                        </ul>
                    )}
                    <ul className="mod_address_slide_list_3">
                        <li className="selections_group">
                            <a className="green actCfm" onClick={() => {
                                this.props.onClose && this.props.onClose();
                            }}>关闭</a>
                        </li>
                    </ul>
                </div>
            :  null
        );
    }




}