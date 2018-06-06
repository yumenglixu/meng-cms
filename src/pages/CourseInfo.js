import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {observer} from "mobx-react";
import {extendObservable, observable, autorun} from "mobx";
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
            catelist: [],


            list: [{}],
            activePage: 1,
            detailInfo: {
                rows:  []
            },
            education: {
                start_date: moment(),
                finish_date: moment(),
                school: '',
                major: '',
                education: ''
            },
            titleModal: '创建班级',
            showModal: false,


            // 各个浮层展示
            cateModal: false,
        });
        this.getCate();
        // this.getDetail();
    }

    render() {
        return (
            <div className="base-info">
                <div className="title-box">课程详情</div>
                <div className="box-input m-entry clearfix">
                    <dl className="col-6">
                        <dt>课程名称</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput"  type="text" placeholder="请输入课程名称（15个字）" value={this.detailInfo.name} onChange={(v)=>{
                                    this.detailInfo.name = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-6">
                        <dt>课程品类</dt>
                        <dd className="wrap-sug"  onClick={() => {
                            this.cateModal = !this.cateModal;
                        }}>
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput" type="text" readOnly  placeholder="请输入行业分类" value={this.detailInfo.categoryName}/>
                            </div>
                        </dd>
                        <i className="select-shixin-arrow"></i>
                        <MyActionSheetChoose
                            maskClosable={true}
                            index = {this.detailInfo.categoryId || ''}
                            data = {this.catelist}
                            top={48}
                            left={120}
                            onClose={() => {     
                                this.cateModal = false;
                            }}
                            onChange={(val) => {  
                                if (val) {
                                    this.detailInfo.categoryName = val.name;
                                    this.detailInfo.categoryId= val.key;
                                }
                                this.cateModal = false;
                            }}
                            visible={this.cateModal}>
                        </MyActionSheetChoose>

                    </dl>
                    <dl className="col-4">
                        <dt>课程价格</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput"  type="number" placeholder="请输入课程价格" value={this.detailInfo.price} onChange={(v)=>{
                                    let value = v.target.value;
                                    this.detailInfo.price = value;
                                    setTimeout(() => {
                                        this.priceCourse(value);
                                    }, 400);
                                }}/>
                                <div className="unit">元</div>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-4">
                        <dt>价格单位</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput" type="text"   placeholder="请输入价格单位" value={this.detailInfo.priceUnit}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-4">
                        <dt>预期结算</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput" type="text" readOnly  placeholder="请输入预期结算" value={this.detailInfo.settleAmount}/>
                                <div className="unit">元/ 订单</div>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-4">
                        <dt>课程开始日期</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <DatePicker value={moment(this.detailInfo.cstartDate)} onChange={(v)=>{
                                    this.detailInfo.cstartDate = v.format('YYYY-MM-DD');
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-4">
                        <dt>课程结束日期</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <DatePicker value={moment(this.detailInfo.cendDate)} onChange={(v)=>{
                                    this.detailInfo.cendDate = v.format('YYYY-MM-DD');
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-4">
                        <dt>报名截止日期</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <DatePicker value={moment(this.detailInfo.eendDate)} onChange={(v)=>{
                                    this.detailInfo.eendDate = v.format('YYYY-MM-DD');
                                }}/>
                            </div>
                        </dd>
                    </dl>
                </div>
                <div className="title-box">课程照片，最多6张照片</div>
                <div className="user-img">
                    {this.detailInfo.rows.map((lv, lk) => {
                        return (
                            <div className="col-2" style={{height: 160}} key={lk}>
                                <div className={"ant-upload ant-upload-drag " + (lv.imgLinks && "no-b-all")}>
                                    <div className="img">
                                        <img  src={config.HOST_IMG +  lv.imgLinks + "?t=" + (moment())}/>
                                        <span className="del" title="删除图片" onClick={() => {
                                            this.detailInfo.rows.splice(lk, 1);
                                        }}><Icon type="delete" /></span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {this.detailInfo.rows.length < 6 && (
                        <div className="col-2" style={{height: 160}}>
                            <div className="ant-upload ant-upload-drag">
                                <div className="ant-upload ant-upload-btn">
                                    <div className="ant-upload-drag-container"><Icon type="upload" /><span>请上传照片</span></div>
                                </div>
                                <input type="file" className="file" accept="image/*" onChange={(evt) => {
                                    var file = evt.target.files[0];
                                    if (file.type.indexOf('image/') > -1) {
                                        utils.uploadImg(file).then((res)=>{
                                            this.detailInfo.rows.push({
                                                imgLinks: res.fileName
                                            });
                                        });
                                    }
                                }}/>
                            </div>
                        </div>
                    )}
                </div>
                <div className="title-box">其他信息</div>
                <div className="box-input m-entry clearfix">
                    <dl>
                        <dt>上课地址</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput"  type="text" placeholder="请输入上课地址" value={this.detailInfo.address} onChange={(v)=>{
                                    this.detailInfo.address = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>  
                    <dl className="col-6">
                        <dt>适合年龄</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput"  type="text" placeholder="请输入适合年龄" value={this.detailInfo.properAges} onChange={(v)=>{
                                    this.detailInfo.properAges = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-6">
                        <dt>已参加人数</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput" type="text" readOnly  placeholder="请输入行业分类" value={this.detailInfo.cecount}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-6">
                        <dt>视频信号有效</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <RadioGroup onChange={(e) => {
                                    this.detailInfo.rollDiffWay = e.target.value;
                                }} value={this.detailInfo.rollDiffWay || 1}>
                                    <Radio key="1" value={1}>开启直播</Radio>
                                    <Radio key="2" value={2}>关闭直播</Radio>
                                </RadioGroup>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-6">
                        <dt>视频播放地址</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput" type="text"  placeholder="请输入视频播放地址" value={this.detailInfo.videoPlayLink} onChange={(v)=>{
                                    this.detailInfo.videoPlayLink = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl>
                        <dt>备注信息</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput" type="text"  placeholder="请输入备注信息" value={this.detailInfo.note} onChange={(v)=>{
                                    this.detailInfo.note = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                </div>
                <div className="title-box">
                    班级管理
                    <div className="pull-right">
                        <button className="input-btn input-btn-hover" onClick={() => {
                            this.showModal = true;
                        }}>
                            <Icon type="plus" />
                            创建班级
                        </button>
                    </div>
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
                <Modal 
                    show={this.showModal}
                    title={this.titleModal}
                    onClose={() => {
                        this.showModal = false;
                    }}
                    onSubmit={() => {
                        {/* this.handleResumeInfo(); */}
                    }}
                >
                    {this.classHandle()}
                </Modal>
            </div>
        );
    }
    classHandle() {
        return (
            <ul>
                <li className="item border-t userName">
                    <Label>开始时间</Label>
                    <DatePicker value={this.education.start_date} onChange={(e) => {
                        this.education.start_date = e;
                    }}/>
                </li>
                <li className="item border-t userName">
                    <Label>结束时间</Label>
                    <DatePicker value={this.education.finish_date} onChange={(e) => {
                        this.education.finish_date = e;
                    }}/>
                </li>
                <li className="item border-t userName">
                    <input type="text" className="the_input topSpecial users_tel" value={this.education.school}  onChange={(v) => {
                        this.education.school = v.target.value;
                    }} placeholder="请输入您的学校"/>
                </li>
                <li className="item border-t userName">
                    <input type="text" className="the_input topSpecial users_tel" value={this.education.major}  onChange={(v) => {
                        this.education.major = v.target.value;
                    }} placeholder="请输入您的专业"/>
                </li>
                <li className="item border-t userName">
                    <input type="text" className="the_input topSpecial users_tel" readOnly value={this.education.education} placeholder="请输入您的学历" onClick={() => {
                        this.eduModal = !this.eduModal;
                    }}/>
                    <i className="select-shixin-arrow"></i>
                    <MyActionSheetChoose
                        maskClosable={true}
                        index ={this.education.education || ''}
                        top={48}
                        onClose={() => {     
                            this.eduModal = false;
                        }}
                        onChange={(val) => {  
                            if (val) {
                                this.education.education = val.key;
                            }
                            this.eduModal = false;
                        }}
                        visible={this.eduModal}>
                    </MyActionSheetChoose>
                </li>
            </ul> 
        );
    }

    getCate() {
        Service.getCategory({
            pageIndex: 1,
            pageSize: 10000
        }).then((res)=>{
            let info = {};
            if (res.rspCode == '0000000000' && res.body) {
               this.catelist = res.body.list.map(val => {
                   return {
                       name: val.categoryName,
                       key: val.id
                   }
               });
               this.getDetail();
            }
        });
    }
    /**
     * 获取详情
     */
    getDetail() {
        message.loading('信息加载中', 3);
        let info = Cookies.get('userInfo');
        Service.getCourseDetail({
            id: this.id
        }).then((res)=>{
            let info = {};
            if (res.rspCode == '0000000000' && res.body) {
                let categoryName = '';
                this.catelist.forEach(val => {
                    if (val.key == res.body.categoryId) {
                        categoryName = val.name;
                    }
                });
                res.body.settleAmount = 0;
                res.body.categoryName = categoryName;
                this.detailInfo = res.body;
                this.priceCourse(this.detailInfo.price);
            }
            message.destroy();
        });
    }

    priceCourse(price) {
        let info = JSON.parse(Cookies.get('userInfo'));
        Service.settleAmount({
            corId: info.corid,
            originalAmount: parseFloat(price).toFixed(2)
        }).then((res)=>{
            if (res.rspCode == '0000000000' && res.body) {
                this.detailInfo.settleAmount = res.body.settleAmount;
            }
        });
    }
});
