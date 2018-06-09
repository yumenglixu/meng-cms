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
import Service from '../config/service';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import moment from 'moment';
const queryString = require('query-string');
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
let Info = observer(class Coupon extends Component {
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
            list: [],
            activePage: 1,
            initLoading: true
        });
        this.reset();
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
                                        <label for="select" >优惠券类型</label>
                                    </div>
                                    {getFieldDecorator('couponSource', {initialValue:''})(
                                        <Select id="select" size="large" initialValue="" style={{width: 150}}>
                                            <Option value="">不限</Option>
                                            <Option value="0">平台优惠券</Option>
                                            <Option value="1">商家优惠券</Option>
                                            <Option value="2">其他</Option>
                                        </Select>
                                    )}
                                </div>
                                <div className="ant-row ant-form-item" style={{width: 250}}>
                                    <div className="ant-form-item-label">
                                        <label for="select" >优惠对象</label>
                                    </div>
                                    {getFieldDecorator('coupObj', {initialValue:'1'})(
                                        <Select id="select" size="large" initialValue="1" style={{width: 150}}>
                                            <Option value="1">全场通用</Option>
                                            <Option value="2">品类内通用</Option>
                                            <Option value="3">指定课程</Option>
                                        </Select>
                                    )}
                                </div>
                                <div className="ant-row ant-form-item" style={{width: 250}}>
                                    <div className="ant-form-item-label">
                                        <label for="select" >优惠券ID</label>
                                    </div>
                                    {getFieldDecorator('id', {initialValue: ''})(
                                        <Input type="uid" placeholder="请输入优惠券ID" style={{width: 150}}/>
                                    )}
                                </div>
                                <Button type="primary" onClick={this.reset.bind(this)}>查 询</Button>
                                <Button type="danger" className="fr" onClick={() => {
                                    this.props.history.push('/cms/coupon/add');
                                }}>
                                    <Icon type="pay-circle" />
                                    新增优惠券
                                </Button>
                            </Form>
                        </Form>
                    </div>

                    <div className="review-list-container">
                        <div className="review-table">
                            <div className="ant-row review-border review-head">
                                <div className="ant-col-2">优惠券ID</div>
                                <div className="ant-col-2">优惠券类型</div>
                                <div className="ant-col-3">优惠对象</div>
                                <div className="ant-col-2">折扣方式</div>
                                <div className="ant-col-2">优惠额度</div>
                                <div className="ant-col-2">封顶额度</div>
                                <div className="ant-col-4">有效期范围</div>
                                <div className="ant-col-2 col-center">券状态</div>
                                <div className="ant-col-2">最近修改人</div>
                                <div className="ant-col-3 col-center">操作</div>
                            </div>
                            {!this.initLoading && this.list.map((val, key) => {
                                return (
                                    <div className="ant-row review-content review-border" key={key}>
                                        <div className="ant-col-2 col-height">
                                            <span>{val.id}</span>
                                        </div>
                                        <div className="ant-col-2 col-height">
                                            <span>{val.couponSourceName}</span>
                                        </div>
                                        <div className="ant-col-3 col-height">
                                            <span>{val.coupObjName}</span>
                                        </div>
                                        <div className="ant-col-2 col-height">
                                            <span>{val.discountMethod == 0 ? '金额折扣' : '比例折扣'}</span>
                                        </div>
                                        <div className="ant-col-2 col-height">
                                            <span>{val.couponValue} {val.discountMethod == 0 ? '元' : '%'}</span>
                                        </div>
                                        <div className="ant-col-2 col-height">
                                            <span>{val.cappedAmount}</span>
                                        </div>
                                        <div className="ant-col-4 col-height">
                                            <span>{val.atimeStart} ~ {val.atimeEnd}</span>
                                        </div>
                                        <div className="ant-col-2 col-height">
                                            <span>{val.couponStatus == 0 ? '有效' : '废弃'}</span>
                                        </div>
                                        <div className="ant-col-2 col-height">
                                            <span>{val.modifyUserName}</span>
                                        </div>
                                        <div className="ant-col-3 col-height handle-branch-menu">
                                            <Button type="ghost" onClick={() => {
                                                this.props.history.push(`/cms/coupon/info/${val.id}`);    
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
        let {couponSource, id, coupObj} = this.props.form.getFieldsValue();
        Service.getCouponList({
            couponSource,
            id,
            coupObj,
            pageIndex: this.activePage,
            pageSize: 10
        }).then(res => {
            if (res.rspCode == '0000000000') {
                this.list = res.body.list.map(val => {
                    // 平台类型
                    switch(+val.couponSource) {
                        case 0:
                            val.couponSourceName = '平台优惠券'
                        break;
                        case 1:
                            val.couponSourceName = '商户优惠券'
                        break;
                        case 2:
                            val.couponSourceName = '其他'
                        break;
                    }
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
});

Info = Form.create()(Info);
export default Info;
