import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import {observer} from "mobx-react";
import {extendObservable,observable,autorun} from "mobx";
import { Icon } from 'antd';
const queryString = require('query-string');

// 导航
const tab = [{
    name: '机构基础信息',
    router: 'info',
    icon: 'team'
}, {
    name: '机构落地页配置',
    router: 'shop',
    icon: 'shopping-cart'
}, {
    name: '课程管理',
    router: 'shop',
    icon: 'shopping-cart'
}, {
    name: '订单管理',
    router: 'shop',
    icon: 'shopping-cart'
}];

export default observer(class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            type: ''
        }
        extendObservable(this,{
            className: "",
            isHomeRoute: false,
            loginClassName: 'login-group'
        });
    }

    render() {
        return (
            <div className="page-content">
                {this.props.children}
            </div>
        );
    }
});
