import React, { Component } from 'react';
import {ButtonGroup, Button} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';
import {observer} from "mobx-react";
import {extendObservable,observable,autorun} from "mobx";
import {Icon, Tooltip, Breadcrumb, Dropdown, Menu} from 'antd';
import Service from '../config/service';
import Cookies from 'js-cookie';
const queryString = require('query-string');
const menu = (
    <Menu onClick={(e) => {
        if(e.key == '/logout'){
            Cookies.remove('access_token');
            Service.logout().then((res)=>{
                window.location.href = '/login';
            }); 
        }
    }}>
        {/* <Menu.Item  key="/me">
            <a>个人中心</a>
        </Menu.Item>
        <Menu.Divider/> */}
        <Menu.Item  key="/logout">
            <a>退出系统</a>
        </Menu.Item>
    </Menu>
  );

  
const Header = observer(class LeftNavCompent extends Component {
    constructor(props){
        super(props);
        extendObservable(this,{
            className: "",
            breadCrumb: '',
            info: ''
        });
        let info = Cookies.get('userInfo');
        if (info) {
            this.info = JSON.parse(info);
        }
    }
    componentWillReceiveProps(props){
        this.checkHomeRoute();
    }
    componentWillMount() {
        this.checkHomeRoute();
    }
    checkHomeRoute() {
        if (this.props.history.location.pathname.indexOf('/admin/work') > -1) {
            this.breadCrumb = '渠道管理';
        }
        else if (this.props.history.location.pathname.indexOf('/admin/setting') > -1) {
            this.breadCrumb = '系统设置'
        }
        else if (this.props.history.location.pathname.indexOf('/admin/user') > -1) {
            this.breadCrumb = '管理员设置'
        }
    }
    render() {
        return (
            <div className="top-nav-main">
                <div className="top-nav-bread-crumb">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>后台管理系统CMS</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <li className="hidden-xs">
                    <a href="http://amis.baidu.com/" target="_blank">Mis</a>
                </li>
                <Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link top-nav-more">
                        <div className="avatar-main top-nav-avatar">
                            <img className="avatar-image" src={this.info.imgHead || require('../images/avatar.png')} title={this.info.account} alt={this.info.account}/>
                        </div>
                        <Icon type="down" />
                    </a>
                </Dropdown>
            </div>
        );
    }
});
export default Header;
