import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {observer} from "mobx-react";
import {extendObservable, observable, autorun} from "mobx";
import {
    Icon,
    Tooltip,
    Form,
    Input,
    InputNumber,
    Select,
    Cascader,
    Upload,
    Button,
    Pagination
} from 'antd';
import objectAssign from 'object-assign';
const queryString = require('query-string');
const Option = Select.Option;
let Info = observer(class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            total: 10
        }
        extendObservable(this, {
            baseInfo: {
                name: ''
            },
            list: [{}],
            activePage: 1,
        });
        
    }

    render() {
        let {form: {getFieldDecorator}} = this.props;
        return (
            <div className="base-info">
                <div className="review-container">
                    <div className="review-filter">
                        <Form className="ant-row review-border review-head">
                            <Form layout="inline">
                                <div className="ant-row ant-form-item" style={{width: 250}}>
                                    <div className="ant-form-item-label">
                                        <label for="select" class="" title="课程名称">课程名称</label>
                                    </div>
                                    {getFieldDecorator('personal_verification', {initialValue: ''})(
                                        <Input type="uid" placeholder="请输入用户ID" style={{width: 150}}/>
                                    )}
                                </div>
                                <div className="ant-row ant-form-item" style={{width: 250}}>
                                    <div className="ant-form-item-label">
                                        <label for="select" class="" title="课程名称">课程名称</label>
                                    </div>
                                    {getFieldDecorator('personal_verification', {initialValue: ''})(
                                        <Input type="uid" placeholder="请输入用户ID" style={{width: 150}}/>
                                    )}
                                </div>
                                <div className="ant-row ant-form-item" style={{width: 250}}>
                                    <div className="ant-form-item-label">
                                        <label for="select" class="" title="课程状态">课程状态</label>
                                    </div>
                                    {getFieldDecorator('business_verification', {initialValue:''})(
                                        <Select id="select" size="large" initialValue="" style={{width: 150}}>
                                            <Option value="">不限</Option>
                                            <Option value="1">待提交</Option>
                                            <Option value="2">已提交</Option>
                                            <Option value="0">失败</Option>
                                        </Select>
                                    )}
                                </div>
                                <Button type="primary" onClick={() => {
                                   
                                }}>查 询</Button>
                                <Button type="danger" className="fr" onClick={() => {
                                    this.activePage = 1;
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
                                <div className="ant-col-6">课程名称</div>
                                <div className="ant-col-2">开始日期</div>
                                <div className="ant-col-2">报名截止日期</div>
                                <div className="ant-col-2">课程状态</div>
                                <div className="ant-col-2">报名人数</div>
                                <div className="ant-col-2 col-center">课程价格</div>
                                <div className="ant-col-6 col-center">操作</div>
                            </div>
                            <div className="ant-row review-content review-border">
                                <div className="ant-col-2 col-height">
                                    <span>1001</span>
                                </div>
                                <div className="ant-col-6 col-height">
                                    <span>1001</span>
                                </div>
                                <div className="ant-col-2 col-height">
                                    <span>1001</span>
                                </div>
                                <div className="ant-col-2 col-height">
                                    <span>1001</span>
                                </div>
                                <div className="ant-col-2 col-height">
                                    <span>1001</span>
                                </div>
                                <div className="ant-col-2 col-height">
                                    <span>1001</span>
                                </div>
                                <div className="ant-col-2 col-height">
                                    <span>1001</span>
                                </div>
                                <div className="ant-col-6 col-height handle-branch-menu">
                                    <Button type="ghost">提交审核</Button>
                                    <Button type="ghost">下线</Button>
                                    <Button type="ghost" onClick={() => {
                                        this.props.history.push('/cms/course/info/1');    
                                    }}>详情</Button>
                                </div>
                            </div>
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
});

Info = Form.create()(Info);
export default Info;
