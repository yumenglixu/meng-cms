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
    message
} from 'antd';
import objectAssign from 'object-assign';
import Cookies from 'js-cookie';
import moment from 'moment';
import Service from '../config/service';
import config from '../config/config';
import utils from '../config/utils';
const queryString = require('query-string');
const Dragger = Upload.Dragger;
export default observer(class Page extends Component {
    constructor(props) {
        super(props);
        extendObservable(this, {
            id: -1,
            corporat: [{
                title: '机构介绍、历史、荣誉、业务、资质，最多6张照片',
                max: 6,
                list: []
            }, {
                title: '培训校区场地，课程展示，最多6张照片',
                max: 6,
                list: []
            }, {
                title: '教练展示，最多6张照片',
                max: 6,
                list: []
            }, {
                title: '学员风采，最多6张照片',
                max: 6,
                list: []
            }]
        });   
        this.getDetail();
    }

    render() {
        return (
            <div className="base-info">
                {this.corporat.map((val, key) => {
                    return (
                        <div key={key}>
                            <div className="title-box">{val.title}</div>
                            <div className="user-img">
                                {val.list.map((lv, lk) => {
                                    return (
                                        <div className="col-2" style={{height: 160}} key={lk}>
                                            <div className={"ant-upload ant-upload-drag " + (lv.imgLinks && "no-b-all")}>
                                                <div className="img">
                                                    <img  src={config.HOST_IMG +  lv.imgLinks + "?t=" + (moment())}/>
                                                    <span className="del" title="删除图片" onClick={() => {
                                                        val.list.splice(lk, 1);
                                                    }}><Icon type="delete" /></span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                {val.list.length < val.max && (
                                    <div className="col-2" style={{height: 160}}>
                                        <div className="ant-upload ant-upload-drag">
                                            <div className="ant-upload ant-upload-btn">
                                                <div className="ant-upload-drag-container"><Icon type="upload" /><span>请上传照片</span></div>
                                            </div>
                                            <input type="file" className="file" accept="image/*" onChange={(evt) => {
                                                var file = evt.target.files[0];
                                                if (file.type.indexOf('image/') > -1) {
                                                    utils.uploadImg(file).then((res)=>{
                                                        val.list.push({
                                                            imgLinks: res.fileName
                                                        });
                                                    });
                                                }
                                            }}/>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
                <div className="login-group-btn" style={{marginTop: 25}}>
                    <button className="input-btn btn-primary" onClick={this.updateInfo.bind(this)}>
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
            let id = JSON.parse(info).id;
            Service.getCorporat({
                id
            }).then((res)=>{
                let info = {};
                if (res.rspCode == '0000000000' && res.body) {
                    info = res.body || {};  
                    this.id = id;
                    this.corporat[0].list = info.introduces;
                    this.corporat[1].list = info.sites;
                    this.corporat[2].list = info.coachs;
                    this.corporat[3].list = info.stuStyle;
                }
                message.destroy();
            });
        }
    }
    updateInfo() {
        let params = {
            id: this.id,
            introduces: this.corporat[0].list,
            sites: this.corporat[1].list,
            coachs: this.corporat[2].list,
            stuStyle: this.corporat[3].list
        };
        Service.setCorporat(params).then((res)=>{
            if (res.rspCode == '0000000000') {
                message.success('机构落地页配置成功');
            }
            else {
                message.error(res.rspMsg || '未知原因导致失败');
            }
        });
    }
});
