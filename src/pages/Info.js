import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {observer} from "mobx-react";
import {extendObservable, observable, autorun, computed} from "mobx";
import {
    Icon,
    Tooltip,
    Form,
    Input,
    InputNumber,
    Select,
    Cascader,
    Upload,
    message,
    Radio
} from 'antd';
import objectAssign from 'object-assign';
import Service from '../config/service';
import  utils from '../config/utils';
import Cookies from 'js-cookie';
import config from '../config/config';
import MyActionSheetLocal from '../components/MyActionSheetLocal';
const queryString = require('query-string');
const Dragger = Upload.Dragger;
const RadioGroup = Radio.Group;

export default observer(class Info extends Component {
    constructor(props) {
        super(props);
        extendObservable(this, {
            settingLocalModal: false,
            settingLocalModalBank: false,
            coachsLabel: [
                '身份证正面照',
                '身份证国徽面',
                '手持身份证人像面'
            ],
            detailInfo: {
                coachs: [{
                    imgLinks: ''
                }, {
                    imgLinks: ''
                }, {
                    imgLinks: ''
                }]
            },
            addressId: computed(()=>{
                let cityCode = [];
                if (this.detailInfo.cityCode) {
                    cityCode = this.detailInfo.cityCode.split(':');
                }
                return cityCode;
            }),
            addressName: computed(()=>{
                let cityName = [];
                if (this.detailInfo.cityDes) {
                    cityName = this.detailInfo.cityDes.split(':');
                }
                return cityName;
            })
        });
        this.getDetail();
    }

    render() {
        return (
            <div className="base-info">
                <div className="title-box">机构信息</div>
                <div className="box-input m-entry clearfix">
                    <dl>
                        <dt>机构名称</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug">
                                <input className="sugInput"  type="text" placeholder="请输入机构名称" value={this.detailInfo.name} onChange={(v)=>{
                                    this.detailInfo.name = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl  className="col-6">
                        <dt>机构电话</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug">
                                <input className="sugInput" type="text"   placeholder="请输入机构电话" value={this.detailInfo.contractNumber} onChange={(v)=>{
                                    this.detailInfo.contractNumber = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-6">
                        <dt>所在省市区</dt>
                        <dd className="wrap-sug"  onClick={() => {
                            this.settingLocalModal = !this.settingLocalModal;
                        }}>
                            <div className="u-sug">
                                <input className="sugInput" type="text" readOnly  placeholder="请选择所在省份" value={this.addressName.join('-')}/>
                            </div>
                        </dd>
                        <i className="select-shixin-arrow"></i>
                        {/* 地址 */}
                        <MyActionSheetLocal
                            left={120}
                            onClose={(val)=>{
                                if (val) {
                                    console.log(val);
                                    let id = [];
                                    let name = [];
                                    id.push(val.pid);
                                    id.push(val.cid);
                                    name.push(val.pname);
                                    name.push(val.cname);
                                    if (val.couid != -1) {
                                        id.push(val.couid);
                                        name.push(val.couname);
                                    }
                                    this.detailInfo.cityCode = id.join(':');
                                    this.detailInfo.cityDes = name.join(':');
                                }
                                
                                this.settingLocalModal = false;
                            }}
                            pid={this.addressId[0]}
                            cid={this.addressId[1]}
                            couid={this.addressId[2]}
                            pname={this.addressName[0]}
                            cname={this.addressName[1]}
                            couname={this.addressName[2]}
                            visible={this.settingLocalModal}
                        >
                        </MyActionSheetLocal>
                    </dl>
                    <dl>
                        <dt>机构地址</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug">
                                <input className="sugInput" type="text"   placeholder="请输入机构地址" value={this.detailInfo.address} onChange={(v)=>{
                                    this.detailInfo.address = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-6">
                        <dt>负责人姓名</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug">
                                <input className="sugInput"  type="text" placeholder="请输入负责人姓名" value={this.detailInfo.prinName} onChange={(v)=>{
                                    this.detailInfo.prinName = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-6">
                        <dt>身份证号</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug">
                                <input className="sugInput"  type="number" placeholder="请输入身份证号" value={this.detailInfo.idCardNo} onChange={(v)=>{
                                    this.detailInfo.idCardNo = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-6">
                        <dt>手机号</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug">
                                <input className="sugInput"  type="number" placeholder="请输入手机号" value={this.detailInfo.mobileNo} onChange={(v)=>{
                                    this.detailInfo.mobileNo = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-6">
                        <dt>电子邮件</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug">
                                <input className="sugInput"  type="email" placeholder="请输入电子邮件" value={this.detailInfo.email} onChange={(v)=>{
                                    this.detailInfo.email = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                </div>
                <div className="title-box">身份证信息</div>
                <div className="user-img">
                    {this.detailInfo.coachs.length && this.detailInfo.coachs.map((val, key) => {
                        return (
                            <div className="fl pr " style={{ width: 258, height: 160, marginRight: 12}} key={key}>
                                <div className={"ant-upload ant-upload-drag " + (val.imgLinks && "no-b-all")}>
                                    {val.imgLinks != '' ? (
                                        <div className="img">
                                            <img  src={config.HOST_IMG +  val.imgLinks}/>
                                            <span className="tag">{this.coachsLabel[key]}</span>
                                        </div>
                                    ) : (
                                        <div className="ant-upload ant-upload-btn">
                                            <div className="ant-upload-drag-container">
                                                <Icon type="upload" />
                                                <span>{this.coachsLabel[key]}</span>
                                            </div>
                                        </div>
                                    )}
                                    <input type="file" className="file" accept="image/*" onChange={(evt) => {
                                        var file = evt.target.files[0];
                                        if (file.type.indexOf('image/') > -1) {
                                            utils.uploadImg(file).then((res)=>{
                                                if (res.fileName) {
                                                    val.imgLinks = res.fileName;
                                                }
                                            });
                                        }
                                    }}/>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="title-box">银行信息</div>
                <div className="box-input m-entry clearfix">
                    <dl className="col-6">
                        <dt>开户银行</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug">
                                <input className="sugInput"  type="text" placeholder="请输入开户银行名称" value={this.detailInfo.bankName} onChange={(v)=>{
                                    this.detailInfo.bankName = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-6">
                        <dt>开户支行</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug">
                                <input className="sugInput" type="text"   placeholder="请输入开户支行" value={this.detailInfo.branchBankName} onChange={(v)=>{
                                    this.detailInfo.branchBankName = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-4">
                        <dt>开户行省份</dt>
                        <dd className="wrap-sug"  onClick={() => {
                            this.settingLocalModalBank = !this.settingLocalModalBank;
                        }}>
                            <div className="u-sug">
                                <input className="sugInput" type="text" readOnly  placeholder="请选择所在省份" value={this.detailInfo.bankProvinceName + '-' + this.detailInfo.bankCityName}/>
                            </div>
                        </dd>
                        <i className="select-shixin-arrow"></i>
                        {/* 地址 */}
                        <MyActionSheetLocal
                            left={120}
                            onClose={(val)=>{
                                if (val) {
                                    this.detailInfo.bankProvince = val.pid;
                                    this.detailInfo.bankCity = val.cid;
                                    this.detailInfo.bankProvinceName = val.pname;
                                    this.detailInfo.bankCityName = val.cname;
                                }
                                this.settingLocalModalBank = false;
                            }}
                            deep={2}
                            pid={this.detailInfo.bankProvince}
                            cid={this.detailInfo.bankCity}
                            pname={this.detailInfo.bankProvinceName}
                            cname={this.detailInfo.bankCityName}
                            visible={this.settingLocalModalBank}
                        >
                        </MyActionSheetLocal>

                    </dl>
                    <dl className="col-4">
                        <dt>开户名称</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug">
                                <input className="sugInput"  type="text" placeholder="请输入开户名称" value={this.detailInfo.accountName} onChange={(v)=>{
                                    this.detailInfo.accountName = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-4">
                        <dt>账号</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug">
                                <input className="sugInput"  type="text" placeholder="请输入账号" value={this.detailInfo.account} onChange={(v)=>{
                                    this.detailInfo.account = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                </div>
                <div className="title-box">轧差配置</div>
                <div className="box-input m-entry clearfix">
                    <dl className="col-6">
                        <dt>轧差配置方式</dt>
                        <dd className="wrap-sug"  onClick={() => {
                            this.settingModal = !this.settingModal;
                        }}>
                            <div className="u-sug">
                                <RadioGroup onChange={(e) => {
                                    this.detailInfo.rollDiffWay = e.target.value;
                                }} value={this.detailInfo.rollDiffWay}>
                                    <Radio key="0" value={0}>金额扣减</Radio>
                                    <Radio key="1" value={1}>按比例折扣</Radio>    
                                </RadioGroup>
                            </div>
                        </dd>
                    </dl>
                    <dl className="col-6">
                        <dt>轧差配置数值</dt>
                        <dd className="wrap-sug">
                            <div className="u-sug">
                                <input className="sugInput"  type="number" placeholder="请输入轧差配置数值" value={this.detailInfo.rollDiffVal} onChange={(v)=>{
                                    this.detailInfo.rollDiffVal = v.target.value;
                                }}/>
                            </div>
                        </dd>
                    </dl>
                </div>
                <div className="login-group-btn" style={{marginTop: 25}}>
                    <button className="input-btn btn-primary" onClick={this.handle.bind(this)}>
                        保存
                    </button>
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
        if (info) {
            let id = JSON.parse(info).corid;
            Service.getMerchantsInfo({
                id
            }).then((res)=>{
                let info = {};
                if (res.rspCode == '0000000000' && res.body) {
                    info = res.body || {};        
                }
                let coachs = info.coachs || [];
                for (let i = 0; i < 3; i++) {
                    if (!coachs[i]) {
                        coachs[i] = {
                            imgLinks: ''
                        };
                    }
                }
                info.coachs = coachs;
                info.rollDiffWay = res.body ? res.body.rollDiffWay || 0 : 0;
                this.detailInfo = info;
                message.destroy();
            });
        }
    }
    handle() {
        if (this.detailInfo.id) {
            message.loading('信息修改中', 3);
        }
        else {
            message.loading('信息增加中', 3);
        }
        Service.updateMerchantsInfo(this.detailInfo).then((res)=>{
            message.destroy();
            if (res.rspCode == '0000000000') {
                message.success('操作成功');
            }
            else {
                message.error(res.rspMsg || '未知原因导致失败');
            }
        });
    }
});
