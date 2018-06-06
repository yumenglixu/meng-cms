import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch
} from 'react-router-dom';
import {observer} from "mobx-react";
import {extendObservable,observable,autorun} from "mobx";
import {Route,Redirect,IndexRoute,IndexRedirect, withRouter} from 'react-router';
// 引入css
// import './font/iconfont.css';
import '../node_modules/antd/dist/antd.css';
import './css/antd.css'
import './css/App.css'
import './css/Home.css'
import './css/Modal.css'
import './css/login.css'
import './css/cate.css';
// 引入js组件
import Header from './components/Header';
import LeftNav from './components/LeftNav';
// import Footer from './components/Footer';
import Home from './pages/Home';
// 账号
import Login from './pages/Login';
// 各个场景信息
import Info from './pages/Info';
import Page from './pages/Page';
import Course from './pages/Course';
import CourseInfo from './pages/CourseInfo';
import Order from './pages/Order';
// 个人配置
import auth  from './config/auth';
const HeaderWithRouter = withRouter(Header);
const LeftNavWithRouter = withRouter(LeftNav);
const HomeWithRouter = withRouter(Home);

const ScrollToTop =  withRouter(class ScrollToTop extends Component {
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0)
        }
    }
    render() {
        return this.props.children
    }
});

// 路由异步代理组件
class AuthoriztionDelegate extends Component{
    constructor(props){
        super(props);
        // 检测登录状态 针对未登录或在购买页刷新网页时 因为登录状态监测是异步的
        // 直接跳转
        auth.checkStatus().then((isLogin)=>{
            if (isLogin) {
                this.props.history.replace(this.props.location.pathname);
            }
            else {
                window.location.href = '/login?redirect_uri=' + encodeURIComponent(window.location.href);
                return <div></div>;
            }
        });
    }
    render(){   
        return null;
    }
}


let App = observer(class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            showFix: false,
            activeLeft: true
        }
    }
    componentWillReceiveProps(props){
        console.log(props);
    }
    render() {
        return (
            <Router>
                 <ScrollToTop>
                    <Switch>
                        <Route  path="/cms"  render={(props)=>{
                            if (auth.isAuthorized()) {
                                return (
                                    <div id="cms-router" className="app-main">
                                        <LeftNavWithRouter />
                                        <div className="app-content">
                                            <HeaderWithRouter />
                                            <Switch>
                                                <Route path="/cms/info" {...props} component={Info}/>
                                                <Route path="/cms/page" {...props} component={Page}/>
                                                <Route exact={true} path="/cms/course" {...props} component={Course}/>
                                                <Route exact={true} path="/cms/course/info/:id" {...props} component={CourseInfo}/>
                                                <Route path="/cms/order" {...props} component={Order}/>
                                                <Redirect to="/cms/info"/>
                                            </Switch>
                                            {/* <FooterNavWithRouter /> */}
                                        </div>
                                    </div>
                                )
                            }
                            else {
                                return <AuthoriztionDelegate {...props}/>
                            }
                        }}/>
                        <Route exact={true} path="/login" component={Login}/>
                        <Redirect to="/cms"/>
                    </Switch>
                </ScrollToTop>
            </Router>
        );
    }
    componentDidMount() {
        //检查登录状态
        auth.checkStatus();
    }
});
export default App;
