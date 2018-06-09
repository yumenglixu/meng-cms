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
    Pagination,
    DatePicker,
    Table
} from 'antd';
import objectAssign from 'object-assign';
const queryString = require('query-string');
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
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
            list: [{
                id: 1
            }, {
                id: 1
            }, {
                id: 1
            }],
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
                                        <label for="select" class="" >课程ID</label>
                                    </div>
                                    {getFieldDecorator('personal_verification', {initialValue: ''})(
                                        <Input type="uid" placeholder="请输入课程ID" style={{}}/>
                                    )}
                                </div>
                                <div className="ant-row ant-form-item" style={{width: 250}}>
                                    <div className="ant-form-item-label">
                                        <label for="select" class="" >班级ID</label>
                                    </div>
                                    {getFieldDecorator('personal_verification', {initialValue: ''})(
                                        <Input type="uid" placeholder="请输入班级ID" style={{}}/>
                                    )}
                                </div>
                                <div className="ant-row ant-form-item" style={{width: 250}}>
                                    <div className="ant-form-item-label">
                                        <label for="select" class="" >学员姓名</label>
                                    </div>
                                    {getFieldDecorator('personal_verification', {initialValue: ''})(
                                        <Input type="uid" placeholder="请输入学员姓名" style={{}}/>
                                    )}
                                </div>
                                <div className="ant-row ant-form-item" style={{width: 250}}>
                                    <div className="ant-form-item-label">
                                        <label for="select" class="" >学员身份证</label>
                                    </div>
                                    {getFieldDecorator('personal_verification', {initialValue: ''})(
                                        <Input type="uid" placeholder="请输入学员身份证" style={{}}/>
                                    )}
                                </div>
                                <div className="ant-row ant-form-item" style={{width: 250}}>
                                    <div className="ant-form-item-label">
                                        <label for="select" class="" >商家优惠券ID</label>
                                    </div>
                                    {getFieldDecorator('personal_verification', {initialValue: ''})(
                                        <Input type="uid" placeholder="请输入商家优惠券ID" style={{}}/>
                                    )}
                                </div>
                                <div className="ant-row ant-form-item" style={{width: 250}}>
                                    <div className="ant-form-item-label">
                                        <label for="select" class="">订单状态</label>
                                    </div>
                                    {getFieldDecorator('business_verification', {initialValue:''})(
                                        <Select id="select" size="large" initialValue="" style={{}}>
                                            <Option value="">不限</Option>
                                            <Option value="1">待提交</Option>
                                            <Option value="2">已提交</Option>
                                            <Option value="0">失败</Option>
                                        </Select>
                                    )}
                                </div>
                                <div className="ant-row ant-form-item" style={{width: 250}}>
                                    <div className="ant-form-item-label">
                                        <label for="select" class="" >结算单ID</label>
                                    </div>
                                    {getFieldDecorator('personal_verification', {initialValue: ''})(
                                        <Input type="uid" placeholder="请输入结算单ID" style={{}}/>
                                    )}
                                </div>
                                <div className="ant-row ant-form-item" style={{width: 300}}>
                                    <div className="ant-form-item-label">
                                        <label for="select" class="">支付时间范围</label>
                                    </div>
                                    {getFieldDecorator('business_verification', {initialValue:''})(
                                        <RangePicker format="yyyy/MM/dd" style={{ width: 200 }}/>
                                    )}
                                </div>
                                <div className="ant-row ant-form-item" style={{width: 300}}>
                                    <div className="ant-form-item-label">
                                        <label for="select" class="">结算时间范围</label>
                                    </div>
                                    {getFieldDecorator('business_verification', {initialValue:''})(
                                        <RangePicker format="yyyy/MM/dd"  style={{ width: 200 }}/>
                                    )}
                                </div>
                                <Button type="primary" onClick={() => {
                                   
                                }}>查 询</Button>
                            </Form>
                        </Form>
                    </div>
                    <div className="review-list-container">
                        <div className="review-table">
                            <Table columns={[
                                { title: '订单号', width: 100, dataIndex: 'id', key: 'id', fixed: 'left' },
                                { title: '课程名称/ID', dataIndex: 'address', key: '1',  },
                                { title: '班级名称/ID', dataIndex: 'address', key: '2',  },
                                { title: '学员姓名/身份证号', dataIndex: 'address', key: '3',  },
                                { title: '订单金额', dataIndex: 'address', key: '4',  },
                                { title: '平台优惠券', dataIndex: 'address', key: '5',  },
                                { title: '商家优惠券', dataIndex: 'address', key: '6',  },
                                { title: '实际支付金额', dataIndex: 'address', key: '7',  },
                                { title: '订单创建时间', dataIndex: 'address', key: '8',  },
                                { title: '订单支付时间', dataIndex: 'address', key: '8',  },
                                { title: '支付渠道', dataIndex: 'address', key: '8',  },
                                { title: '订单状态', dataIndex: 'address', key: '8',  },
                                { title: '平台结算金额', dataIndex: 'address', key: '8',  },
                                { title: '结算状态', dataIndex: 'address', key: '8',  },
                                { title: '退款时间', dataIndex: 'address', key: '8',  },
                                { title: '结算单ID', dataIndex: 'address', key: '8',  },
                                { title: '结算时间', dataIndex: 'address', key: '8',  },
                                {
                                    title: '操作',
                                    key: 'operation',
                                    fixed: 'right',
                                    width: 100,
                                    render: () => <a href="#">操作</a>,
                                }]
                            } dataSource={this.list} scroll={{ x: 1200}} />
                            {/* <div className="ant-row review-border review-head">
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
                            </div> */}
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
