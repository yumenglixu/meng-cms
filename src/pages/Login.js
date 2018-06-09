import React, { Component } from 'react';
import {extendObservable, observable} from "mobx";
import {observer} from "mobx-react";
import { Breadcrumb, Pagination, Dropdown, Icon, Button, message } from 'antd';
import Cookies from 'js-cookie';
import Qs from 'query-string';
import utils from '../config/utils';
import config from '../config/config';
import Service from '../config/service';
// import auth from '../auth';
export default observer(class ShopDetail extends Component {
    constructor(props){
        super(props);
        // 分类
        extendObservable(this, {
            account: "",
            password: '',
            errorMsg: '',
            isLogin: false
        });

    }
    render() {
        return (
            <div className="zx-plans">
                <div className="wrapper login-wrapper">
                    <h1>CMS后台管理-登录</h1>
                    <form className="sign-from sign-from-b">
                        <ul>
                            <li>
                                <input type="text"  value={this.account} onChange={(v) => {
                                    this.account = v.target.value;
                                }} className="inputText topSpecial"  placeholder="请输入手机号" />
                            </li>
                            <li>
                                <input type="password" value={this.password}  onChange={(v) => {
                                    this.password = v.target.value;
                                }} className="inputText topSpecial"  placeholder="请输入密码" />
                            </li>
                            <div className={"error-info " + (this.errorMsg.length > 0 && "is-visible")}>
                                <span><i className="iconfont icon-cuowu"></i>{this.errorMsg}</span>
                            </div>
                            <li className="mt10">
                                <label>
                                    <span>点击登录即表示已阅读并同意</span>
                                    <a href="#" target="_blank">《我的协议》</a>
                                </label>
                            </li>
                        </ul>
                    </form>
                    <div className="login-group-btn">
                        <button className="input-btn input-btn-ghost" type="button" onClick={this.toLogin.bind(this)}>
                            {this.isLogin ? '登录中' : '立即登录'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    toLogin(){
        if (this.isLogin) return;
        if( !this.account.length){
            return this.errorMsg = '手机号不能为空';
        }
        if(!this.password.length){
            return this.errorMsg = '密码不能为空';
        }
        this.isLogin = true;
        this.errorMsg = '';
        Service.login({
            account: this.account,
            password: this.password
        }, this.loginType).then((res)=>{
            if (res.rspCode == '0000000000') {
                Cookies.set('sessionId', res.body.sessionId, {expires: 7});
                Cookies.set('userInfo', JSON.stringify(res.body), {expires: 7});
                // 2s之后登录
                let query = Qs.parse(this.props.location.search);
                setTimeout(() => {
                    if (query.redirect) {
                        window.location.href = decodeURIComponent(query.redirect);
                    } 
                    else {
                        this.props.history.push('/cms');
                    }
                }, 1000);
            }
            else {
                message.error(res.rspMsg || '未知原因导致失败');
            }
            this.isLogin = false;
        }).catch(()=>{
            this.errorMsg = '未知原因导致出错'
            this.isLogin = false;
        });
    }
});
