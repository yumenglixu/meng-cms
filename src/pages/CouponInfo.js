import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {observer} from "mobx-react";
import {extendObservable, observable, autorun, computed} from "mobx";
import moment from 'moment';
import {
    Icon,
    Input,
    InputNumber,
    Select,
    Cascader,
    Upload,
    Button,
    Pagination,
    DatePicker,
    message,
    Radio
} from 'antd';
import objectAssign from 'object-assign';
import { Label } from 'react-bootstrap';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import MyActionSheetChoose from '../components/MyActionSheetChoose';
import Service from '../config/service';
import  utils from '../config/utils';
import Cookies from 'js-cookie';
import config from '../config/config';
const RadioGroup = Radio.Group;
const queryString = require('query-string');
const Option = Select.Option;
export default observer(class CourseInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            total: 10
        }
        extendObservable(this, {
            id: this.props.match.params.id, 
            corid: JSON.parse(Cookies.get('userInfo')).corid,
            courseList: [],
            cateList: [],
            detailInfo: {
                couponSource: 0,
                courseId: '-1',
                categoriesId: '-1',
                discountMethod: 0,
                aTimeStart: moment(),
                aTimeEnd: moment()
            },

            
            couponSourceName: computed(()=>{
                let name = '平台优惠券';
                console.log(this.detailInfo.couponSource);
                config.couponSource.forEach(val => {
                    if (val.key == this.detailInfo.couponSource) {
                        name = val.name;
                    }
                })
                return name;
            }),
            courseName: computed(()=>{
                let name = '全部课程';
                this.courseList.forEach(val => {
                    if (val.key == this.detailInfo.courseId) {
                        name = val.name;
                    }
                })
                return name;
            }),

            cateName: computed(()=>{
                let name = '全部分类';
                this.cateList.forEach(val => {
                    if (val.key == this.detailInfo.categoriesId) {
                        name = val.name;
                    }
                })
                return name;
            }),


            list: [],
            activePage: 1,
            initLoading: false,

            // 各个浮层展示
            couponSourceModal: false,
            courseModal: false,
            cateModal: false,
        });
        if (this.props.type != 'add') {
            this.getDetail();
            this.getOperDetail();
        }
        this.getCate();
        this.getCourseList();
    }

    render() {
        return (
            <div className="base-info">
                <div className="title-box">优惠券详情: {this.id && (
                    <span> (券ID - {this.id})</span>
                )}</div>
                <div className="box-input m-entry clearfix">
                    <dl className="col-6">
                        <dt>优惠券类型</dt>
                        <dd className="wrap-sug"  onClick={() => {
                            this.couponSourceModal = !this.couponSourceModal;
                        }}>
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput" type="text" readOnly  placeholder="请选择优惠券类型" value={this.couponSourceName}/>
                            </div>
                        </dd>
                        <i className="select-shixin-arrow"></i>
                        <MyActionSheetChoose
                            maskClosable={true}
                            index = {this.detailInfo.couponSource || '0'}
                            data = {config.couponSource}
                            top={62}
                            left={120}
                            onClose={() => {     
                                this.couponSourceModal = false;
                            }}
                            onChange={(val) => {  
                                if (val) {
                                    this.detailInfo.couponSource= val.key;
                                }
                                console.log(this.detailInfo.couponSource);
                                this.couponSourceModal = false;
                            }}
                            visible={this.couponSourceModal}>
                        </MyActionSheetChoose>
                    </dl>
                    <dl className="col-6">
                        <dt>优惠课程</dt>
                        <dd className="wrap-sug"  onClick={() => {
                            this.courseModal = !this.courseModal;
                        }}>
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput" type="text"   readOnly placeholder="请输入价格单位" value={this.courseName}/>
                            </div>
                        </dd>
                        <i className="select-shixin-arrow"></i>
                        <MyActionSheetChoose
                            maskClosable={true}
                            index = {this.detailInfo.courseId || '-1'}
                            data = {this.courseList}
                            top={62}
                            left={120}
                            onClose={() => {     
                                this.courseModal = false;
                            }}
                            onChange={(val) => {  
                                if (val) {
                                    this.detailInfo.courseId= val.key;
                                }
                                this.courseModal = false;
                            }}
                            visible={this.courseModal}>
                        </MyActionSheetChoose>
                    </dl>

                    <dl className="col-6">
                        <dt>优惠品类</dt>
                        <dd className="wrap-sug"  onClick={() => {
                            this.cateModal = !this.cateModal;
                        }}>
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput"  type="text" readOnly placeholder="请选择优惠品类" value={this.cateName}/>
                            </div>
                        </dd>
                        <i className="select-shixin-arrow"></i>
                        <MyActionSheetChoose
                            maskClosable={true}
                            index = {this.detailInfo.categoriesId || '-1'}
                            data = {this.cateList}
                            top={62}
                            left={120}
                            onClose={() => {     
                                this.cateModal = false;
                            }}
                            onChange={(val) => {  
                                if (val) {
                                    this.detailInfo.categoriesId= val.key;
                                }
                                this.cateModal = false;
                            }}
                            visible={this.cateModal}>
                        </MyActionSheetChoose>
                    </dl>
                    <dl className="col-6">
                        <dt>折扣方式</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <RadioGroup onChange={(e) => {
                                    this.detailInfo.discountMethod = e.target.value;
                                }} value={this.detailInfo.discountMethod || '0'}>
                                    <Radio key="0" value={'0'}>金额折扣</Radio>
                                    <Radio key="1" value={'1'}>比例折扣</Radio>
                                </RadioGroup>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-6">
                        <dt>优惠额度</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput" type="number"  placeholder="请输入优惠额度" value={this.detailInfo.couponValue} onChange={(v)=>{
                                    this.detailInfo.couponValue = v.target.value;
                                }}/>
                                <div className="unit">{this.detailInfo.discountMethod == 0 ? '元' : '%'}</div>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-6">
                        <dt>封顶金额</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput" type="number"  placeholder="请输入封顶金额" value={this.detailInfo.cappedAmount} onChange={(v)=>{
                                    this.detailInfo.cappedAmount = v.target.value;
                                }}/>
                                <div className="unit">元</div>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-6">
                        <dt>有效期开始</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <DatePicker format="YYYY-MM-DD" value={moment(this.detailInfo.aTimeStart)} onChange={(v)=>{
                                    this.detailInfo.aTimeStart = v;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-6">
                        <dt>有效期结束</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <DatePicker format="YYYY-MM-DD" value={moment(this.detailInfo.aTimeEnd)} onChange={(v)=>{
                                    this.detailInfo.aTimeEnd = v;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                </div>
                {this.id && (
                    <div>
                        <div className="title-box">
                            操作详情
                        </div>
                        <div className="review-list-container">
                            <div className="review-table">
                                <div className="ant-row review-border review-head">
                                    <div className="ant-col-2">序号</div>
                                    <div className="ant-col-4">操作时间</div>
                                    <div className="ant-col-4">操作人</div>
                                    <div className="ant-col-14">操作内容</div>
                                </div>
                                {!this.initLoading && this.list.map((val, key) => {
                                    return (
                                        <div className="ant-row review-content review-content-auto review-border" key={key}>
                                            <div className="ant-col-2 col-height">
                                                <span>{val.id}</span>
                                            </div>
                                            <div className="ant-col-4 col-height">
                                                <span>{val.gmtCreate}</span>
                                            </div>
                                            <div className="ant-col-4 col-height">
                                                <span>{val.modifyUserName}</span>
                                            </div>
                                            <div className="ant-col-14 col-height-auto">
                                                <span dangerouslySetInnerHTML={{__html: val.content}}></span>
                                            </div>
                                        </div>
                                    )
                                })}
                                <Loading show={this.initLoading} message={"加载中..."}/>
                                <NoData show={!this.initLoading && !this.list.length}/>
                            </div>
                        </div>
                    </div>
                )}
                <div className="group-btn" style={{marginTop: 25}}>
                    <button className="input-btn" onClick={this.update.bind(this)}>
                       保存
                    </button>
                    <button className="input-btn input-btn-white" onClick={() => {
                        this.props.history.push('/cms/coupon');
                    }}>返回</button>
                </div>
            </div>
        );
    }
    /**
     * 获取详情
     */
    getDetail() {
        message.loading('信息加载中', 3);
        let info = Cookies.get('userInfo');
        Service.getCouponDetail({
            id: this.id
        }).then((res)=>{
            let info = {};
            if (res.rspCode == '0000000000' && res.body) {
                this.detailInfo = res.body;
            }
            message.destroy();
        });
    }

    getOperDetail() {
        this.initLoading = true;
        Service.getCouponOper({
            id: this.id
        }).then((res)=>{
            let info = {};
            if (res.rspCode == '0000000000' && res.body) {
                this.list = res.body;
            }
            this.initLoading = false;
        });
    }


    getCate() {
        Service.getCategory({
            pageIndex: 1,
            pageSize: 10000
        }).then((res)=>{
            let info = {};
            if (res.rspCode == '0000000000' && res.body) {
                res.body.list.unshift({
                    id: '-1',
                    categoryName: '全部品类'
                });
                this.cateList = res.body.list.map(val => {
                    return {
                        name: val.categoryName,
                        key: val.id
                    }
                });
            }
        });
    }

    getCourseList() {
        Service.getCourseList({
            pageIndex: 1,
            pageSize: 1000000
        }).then(res => {
            if (res.rspCode == '0000000000') {
                res.body.list.unshift({
                    id: '-1',
                    name: '全部课程'
                });
                this.courseList = res.body.list.map(val => {
                    return {
                        key: val.id,
                        name: val.name
                    }
                });
            }
            else {
                this.courseList = [];
            }
        });
    }

    // 更新 or 新增
    update() {
        let {id, couponSource, courseId, categoriesId, aTimeStart, aTimeEnd, cappedAmount, couponValue, discountMethod} = this.detailInfo;
        let params = {
            corporateId: this.corid,
            couponSource,
            courseId,
            categoriesId,
            aTimeStart: moment(aTimeStart).format('YYYY-MM-DD'),
            aTimeEnd: moment(aTimeEnd).format('YYYY-MM-DD'),
            cappedAmount,
            couponValue,
            discountMethod
        };
        // 修改
        if (this.props.type !== 'add' || id) {
            params.id = id;
            Service.updateCoupon(params).then(res => {
                if (res.rspCode == '0000000000') {
                    message.success('操作成功');
                    this.getOperDetail();
                }
                else {
                    message.error(res.rspMsg || '未知原因导致失败');
                }
            });
        }
        else {
            Service.addCoupon(params).then(res => {
                if (res.rspCode == '0000000000') {
                    message.success('操作成功');
                    this.props.history.push('/cms/coupon');
                }
                else {
                    message.error(res.rspMsg || '未知原因导致失败');
                }
            });
        }
    }
});
