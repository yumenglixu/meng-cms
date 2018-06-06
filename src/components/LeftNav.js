import React, { Component } from 'react';
import {ButtonGroup, Button} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';
import {observer} from "mobx-react";
import {extendObservable,observable,autorun} from "mobx";
import {Icon, Tooltip} from 'antd';
const queryString = require('query-string');

const LeftNav = observer(class LeftNavCompent extends Component {
    constructor(props){
        super(props);
        extendObservable(this,{
            className: "",
            isHomeRoute: false,
            loginClassName: 'login-group'
        });
    }

    render() {
        return (
            <div className={ "app-sidebar " + this.className }>
                <div className="main-nav-main">
                    <div className="main-nav-header">
                        <div className="main-nav-logo">
                            <a  href="/" className="active">
                                <img src={require('../images/logo.png')} alt=""/>
                            </a>
                        </div>
                    </div>
                    <div className="main-nav-personal">
                        <ul>
                            <li className="zx-nav__item">
                                <NavLink className="zx-link"  activeClassName="zx-nav__item--active" to="/cms/info"><Icon type="folder-open" />机构基础信息</NavLink>
                            </li>
                            <li className="zx-nav__item">
                                <NavLink className="zx-link"  activeClassName="zx-nav__item--active" to="/cms/page"><Icon type="desktop" />机构落地页配置</NavLink>
                            </li>
                            <li className="zx-nav__item">
                                <NavLink className="zx-link"  activeClassName="zx-nav__item--active" to="/cms/course"><Icon type="appstore" />课程管理</NavLink>
                            </li>
                            <li className="zx-nav__item">
                                <NavLink className="zx-link"  activeClassName="zx-nav__item--active" to="/cms/order"><Icon type="setting" />订单管理</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

});
export default LeftNav;
