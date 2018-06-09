import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {observer} from "mobx-react";
import {extendObservable, observable, autorun} from "mobx";
import {
    Icon,
    Tooltip,
    Form,
    Input,
    message,
    Select,
    Cascader,
    Upload,
    Button,
    Pagination
} from 'antd';
import objectAssign from 'object-assign';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import Service from '../config/service';
import moment from 'moment';
const queryString = require('query-string');
const Option = Select.Option;
let Course = observer(class Course extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 10
        }
        extendObservable(this, {
            list: [],
            activePage: 1,
            initLoading: true
        });
        this.getList();
    }

    render() {
        let {form: {getFieldDecorator}} = this.props;
        return (
            <div className="base-info">
                <div className="review-container">
                    <div className="review-filter">
                        <Form className="ant-row review-border review-head">
                            <Form layout="inline">
                                <div className="ant-row ant-form-item" style={{width: 350}}>
                                    <div className="ant-form-item-label">
                                        <label for="select" class="" title="课程名称">课程名称</label>
                                    </div>
                                    {getFieldDecorator('name', {initialValue: ''})(
                                        <Input type="text" placeholder="请输入课程名称" style={{width: 250}}/>
                                    )}
                                </div>
                                <div className="ant-row ant-form-item" style={{width: 250}}>
                                    <div className="ant-form-item-label">
                                        <label for="select" class="" title="课程状态">课程状态</label>
                                    </div>
                                    {getFieldDecorator('state', {initialValue:''})(
                                        <Select size="large" style={{width: 150}}>
                                            <Option value="">不限</Option>
                                            <Option value="1">待提交</Option>
                                            <Option value="2">待审核</Option>
                                            <Option value="3">上线</Option>
                                            <Option value="4">拒绝</Option>
                                            <Option value="5">下线</Option>
                                        </Select>
                                    )}
                                </div>
                                <Button type="primary" onClick={this.reset.bind(this)}>查 询</Button>
                                <Button type="danger" className="fr" onClick={() => {
                                    this.props.history.push('/cms/course/add');
                                }}>
                                    <Icon type="plus" />
                                    创建课程
                                </Button>
                            </Form>
                        </Form>
                    </div>
                    <div className="review-list-container">
                        <div className="review-table">
                            <div className="ant-row review-border review-head">
                                <div className="ant-col-2">课程ID</div>
                                <div className="ant-col-4">课程名称</div>
                                <div className="ant-col-2">课程开始日期</div>
                                <div className="ant-col-2">课程结束日期</div>
                                <div className="ant-col-2">报名截止日期</div>
                                <div className="ant-col-2">课程状态</div>
                                <div className="ant-col-2">报名人数</div>
                                <div className="ant-col-2 col-center">课程价格</div>
                                <div className="ant-col-6 col-center">操作</div>
                            </div>
                            {!this.initLoading && this.list.map((val, key) => {
                                return (
                                    <div className="ant-row review-content review-border" key={key}>
                                        <div className="ant-col-2 col-height">
                                            <span>{val.id}</span>
                                        </div>
                                        <div className="ant-col-4 col-height">
                                            <span>{val.name}</span>
                                        </div>
                                        <div className="ant-col-2 col-height">
                                            <span>{val.cstartDate}</span>
                                        </div>
                                        <div className="ant-col-2 col-height">
                                            <span>{val.cendDate}</span>
                                        </div>
                                        <div className="ant-col-2 col-height">
                                            <span>{val.eendDate}</span>
                                        </div>
                                        <div className="ant-col-2 col-height">
                                            <span>{val.stateLable}</span>
                                        </div>
                                        <div className="ant-col-2 col-height">
                                            <span>{Math.max(0, val.cecount)} / {val.ccapcity}(总数)</span>
                                        </div>
                                        <div className="ant-col-2 col-height">
                                            <span>{val.price}元 / {val.priceUnit}</span>
                                        </div>
                                        <div className="ant-col-6 col-height handle-branch-menu">
                                            {(val.state == 1 || val.state == 4) && (
                                                <Button typ="ghost" onClick={this.updateState.bind(this, val, 2)}>提交审核</Button>
                                            )}
                                            {/* {val.state == 2 && (
                                                <span className="color-green">已提交(审核中)</span>
                                            )} */}
                                            {val.state == 3 && (
                                                <Button type="ghost" onClick={this.updateState.bind(this, val, 5)}>课程下线</Button>
                                            )}
                                            {val.state == 5 && (
                                                <Button type="ghost" onClick={this.updateState.bind(this, val, 3)}>发布课程</Button>
                                            )}
                                            <Button type="ghost" onClick={() => {
                                                this.props.history.push(`/cms/course/info/${val.id}`);    
                                            }}>查看详情</Button>
                                        </div>
                                    </div>
                                )
                            })}
                            <Loading show={this.initLoading} message={"加载中..."}/>
                            <NoData show={!this.initLoading && !this.list.length}/>
                        </div>
                        {this.list.length > 0 && (
                            <Pagination
                                selectComponentClass={Select}
                                total={this.state.total}
                                showTotal={total => `共 ${total} 条`}
                                pageSize={10}
                                current={this.activePage}
                                defaultCurrent={this.activePage}
                                onChange={(noop) => {
                                    this.activePage = noop;
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }

    reset() {
        this.activePage = 1;
        this.initLoading = true;
        this.getList();
    }
    getList() {
        this.initLoading = true;
        let {name, state} = this.props.form.getFieldsValue();
        Service.getCourseList({
            name,
            state,
            pageIndex: this.activePage,
            pageSize: 10
        }).then(res => {
            if (res.rspCode == '0000000000') {
                this.list = res.body.list.map(val => {
                    val.stateLable = this.getLableStatus(val.state);
                    return val;
                });
                this.setState({
                    total: parseInt(res.body.totalNum, 10)
                });
            }
            else {
                this.list = [];
                this.setState({
                    total: 0
                });
            }
            this.initLoading = false;
        });
    }
    getLableStatus(state) {
        let stateLable = '待提交';
        switch(+state) {
            case 1:
                stateLable = '待提交';
            break; 
            case 2:
                stateLable = '待审核';
            break; 
            case 3:
                stateLable = '已上线';
            break;
            case 4:
                stateLable = '拒绝';
            break;
            case 5:
                stateLable = '已下线';
            break; 
        }
        return stateLable;
    }
    updateState(val, state) {
        Service.updateCourse({
            id: val.id,
            state
        }).then(res => {
            if (res.rspCode == '0000000000') {
                val.state = state;
                val.stateLable = this.getLableStatus(state);
                message.success('操作成功');
            }
            else {
                message.error(res.rspMsg || '未知原因导致失败');
            }
        });
    }
});

Course = Form.create()(Course);
export default Course;
