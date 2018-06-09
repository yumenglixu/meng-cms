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
    Radio,
    Steps
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
const Step = Steps.Step;
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
            catelist: [],
            detailInfo: {
                rows:  [],
                cstartDate: moment(),
                cendDate: moment(),
                eendDate: moment(),
                settleAmount: 0,
                courseAttr: 1
            },


            list: [],
            activePage: 1,
            education: {
                id: '',
                name: '',
                count: '',
                classTime: '',
                classStatus: 0
            },
            titleModal: '创建班级',
            showModal: false,
            initLoading: false,

            // 各个浮层展示
            cateModal: false,

            step: 0
        });
        this.getCate();
    }

    render() {
        return (
            <div className="base-info">
                {this.props.type === 'add' && (
                    <Steps current={this.step}>
                        <Step title="创建课程" description="这里是多信息的描述" />
                        <Step title="创建班级" description="这里是多信息的描述" />
                    </Steps>
                )}
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
                                <DatePicker format="YYYY-MM-DD" value={moment(this.detailInfo.cstartDate)} onChange={(v)=>{
                                    this.detailInfo.cstartDate = v;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-4">
                        <dt>课程结束日期</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <DatePicker format="YYYY-MM-DD" value={moment(this.detailInfo.cendDate)} onChange={(v)=>{
                                    this.detailInfo.cendDate = v;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-4">
                        <dt>报名截止日期</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <DatePicker format="YYYY-MM-DD" value={moment(this.detailInfo.eendDate)} onChange={(v)=>{
                                    this.detailInfo.eendDate = v;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl>
                        <dt>课程属性</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <RadioGroup onChange={(e) => {
                                    this.detailInfo.courseAttr = e.target.value;
                                }} value={this.detailInfo.courseAttr || 1}>
                                    <Radio key="1" value={1}>周末课程</Radio>
                                    <Radio key="2" value={2}>寒暑假课程</Radio>
                                    <Radio key="3" value={3}>国际课程</Radio>
                                </RadioGroup>
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
                                        <div className="img-container" style={{backgroundImage: `url(${config.HOST_IMG}${lv.imgLinks}?t=${moment()})`}}></div>
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
                        <dt>视频信号有效</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <RadioGroup onChange={(e) => {
                                    this.detailInfo.videoState = e.target.value;
                                }} value={this.detailInfo.videoState || 0}>
                                    <Radio key="0" value={0}>开启直播</Radio>
                                    <Radio key="1" value={1}>关闭直播</Radio>
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
                    <dl className={this.props.type === 'add' ? 'col-12' : 'col-6'}>
                        <dt>适合年龄</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput"  type="text" placeholder="比如 18岁-20岁" value={this.detailInfo.properAges} onChange={(v)=>{
                                    this.detailInfo.properAges = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    {this.props.type !== 'add' && (
                        <dl className="col-6">
                            <dt>已参加人数</dt>
                            <dd className="wrap-sug">
                                <div className="u-sug" id="u-sug">
                                    <input className="sugInput" type="text" readOnly   value={this.detailInfo.cecount || 0}/>
                                </div>
                            </dd>
                        </dl>
                    )}
                    <dl>
                        <dt>备注信息</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug" id="u-sug">
                                <input className="sugInput" type="text"  placeholder="请输入备注信息" value={this.detailInfo.description} onChange={(v)=>{
                                    this.detailInfo.description = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                </div>
                {this.id && (
                    <div>
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
                                    <div className="ant-col-2">序号</div>
                                    <div className="ant-col-4">班级名称</div>
                                    <div className="ant-col-5">上课时间说明</div>
                                    <div className="ant-col-2">班级上课人数</div>
                                    <div className="ant-col-2">班级状态</div>
                                    <div className="ant-col-3">更新时间</div>
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
                                            <div className="ant-col-5 col-height">
                                                <span>{val.classTime}</span>
                                            </div>
                                            <div className="ant-col-2 col-height">
                                                <span>{val.pcount}</span>
                                            </div>
                                            <div className="ant-col-2 col-height">
                                                <span>{val.classStatus == 0 ? '生效' : '失效'}</span>
                                            </div>
                                            <div className="ant-col-3 col-height">
                                                <span>{val.gmtModified}</span>
                                            </div>
                                            <div className="ant-col-6 col-height handle-branch-menu">
                                                <Button type="ghost" onClick={() => {
                                                    this.titleModal = '修改信息';
                                                    this.education = {
                                                        id: val.id,
                                                        name: val.name,
                                                        pcount: val.pcount,
                                                        classStatus: val.classStatus,
                                                        classTime: val.classTime
                                                    }
                                                    this.showModal = true;
                                                }}>修改信息</Button>
                                                <Button type="ghost" onClick={() => {
                                                    this.delClassInfo(val.id, key);
                                                }}>删除</Button>
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
                )}
                <div className="group-btn" style={{marginTop: 25}}>
                    <button className="input-btn" onClick={this.update.bind(this)}>
                        {this.props.type === 'add' ? (
                            this.step == 0 ? '下一步' : '保存'
                        ) : '保存'}
                    </button>
                    {(this.detailInfo.state == 1 || this.detailInfo.state == 4) && (
                        <button className="input-btn btn-primary">
                            提交审核
                        </button>
                    )}
                    {this.detailInfo.state == 3 && (
                        <button className="input-btn input-btn-red" onClick={this.updateState.bind(this, 5)}>
                            下线
                        </button>
                    )}
                    {this.detailInfo.state == 5 && (
                        <button className="input-btn btn-primary" onClick={this.updateState.bind(this, 3)}>
                            上线
                        </button>
                    )}
                    <button className="input-btn input-btn-white" onClick={() => {
                        this.props.history.push('/cms/course');
                    }}>返回</button>
                </div>


                <Modal 
                    show={this.showModal}
                    title={this.titleModal}
                    onClose={() => {
                        this.showModal = false;
                    }}
                    onSubmit={() => {
                        this.handleClass();
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
                    <Label>班级名称</Label>
                    <input type="text" className="the_input topSpecial users_tel" value={this.education.name}  onChange={(v) => {
                        this.education.name = v.target.value;
                    }} placeholder="请输入班级名称"/>
                </li>
                <li className="item border-t userName">
                    <Label>上课人数</Label>
                    <input type="number" className="the_input topSpecial users_tel" value={this.education.pcount}  onChange={(v) => {
                        this.education.pcount = v.target.value;
                    }} placeholder="请输入班级上课人数"/>
                </li>
                <li className="item border-t userName">
                    <Label>上课时间</Label>
                    <input type="text" className="the_input topSpecial users_tel" value={this.education.classTime}  onChange={(v) => {
                        this.education.classTime = v.target.value;
                    }} placeholder="请输入班级上课时间"/>
                </li>
                <li className="item border-t userName">
                    <Label>状态</Label>
                    <RadioGroup onChange={(e) => {
                        this.education.classStatus = e.target.value;
                    }} value={this.education.classStatus}>
                        <Radio key="0" value={'0'}>生效</Radio>
                        <Radio key="1" value={'1'}>失效</Radio>
                    </RadioGroup>
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
                if (this.props.type != 'add') {
                    this.getDetail();
                    this.getClassList();
                }
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
        Service.settleAmount({
            corId: this.corid,
            originalAmount: parseFloat(price).toFixed(2)
        }).then((res)=>{
            if (res.rspCode == '0000000000' && res.body) {
                this.detailInfo.settleAmount = res.body.settleAmount;
            }
        });
    }
    
    update() {
        let {id, name, description, address, cstartDate, cendDate, eendDate, ccapcity, properAges, price, priceUnit, categoryId, videoPlayLink, courseAttr, rows, videoState} = this.detailInfo;
        let params = {
            corporateId: this.corid,
            name,
            description,
            address,
            cstartDate: moment(cstartDate).format('YYYY-MM-DD'),
            cendDate: moment(cendDate).format('YYYY-MM-DD'),
            eendDate: moment(eendDate).format('YYYY-MM-DD'),
            ccapcity,
            properAges,
            price,
            priceUnit,
            categoryId,
            videoPlayLink,
            courseAttr,
            rows,
            videoState
        };
        // 修改
        if (this.props.type !== 'add' || id) {
            params.id = id;
            Service.updateCourse(params).then(res => {
                if (res.rspCode == '0000000000') {
                    message.success('操作成功');
                }
                else {
                    message.error(res.rspMsg || '未知原因导致失败');
                }
            });
        }
        else {
            Service.addCourse(params).then(res => {
                if (res.rspCode == '0000000000') {
                    message.success('操作成功');
                    this.step = 1;
                    this.id = res.body.id;
                }
                else {
                    message.error(res.rspMsg || '未知原因导致失败');
                }
            });
        }
    }

    updateState(state) {
        Service.updateCourse({
            id: this.id,
            state
        }).then(res => {
            if (res.rspCode == '0000000000') {
                this.detailInfo.state = state;
                message.success('操作成功');
            }
            else {
                message.error(res.rspMsg || '未知原因导致失败');
            }
        });
    }


    // 获取班级信息
    getClassList() {
        Service.getClassList({
            pageIndex: this.activePage,
            pageSize: 10,
            courseId: this.id
        }).then((res)=>{
            if (res.rspCode == '0000000000') {
                this.list = res.body.list;
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
    delClassInfo(id, index) {
        Service.delClass({
            id
        }).then(res => {
            if (res.rspCode == '0000000000') {
                message.success('操作成功');
                this.list.splice(index, 1);
            }
            else {
                message.error(res.rspMsg || '未知原因导致失败');
            }
        });
    }
    handleClass() {
        let {id, name, pcount, classTime, classStatus} = this.education;
        let params = {
            name,
            pcount,
            classTime
        };
        if (id) {
            params.id = id;
            params.classStatus = classStatus;
        }
        else {
            params.courseId = this.id;
        }
        Service.updateClass(params).then(res => {
            if (res.rspCode == '0000000000') {
                message.success('操作成功');
            }
            else {
                message.error(res.rspMsg || '未知原因导致失败');
            }
            if (!id) {
                this.activePage = 1;
            }
            this.getClassList();
            this.showModal = false;
        });
    }
});
