import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {Table,Button,notification} from 'antd'

export default function Audit() {
    const [dataSource, setdataSource] = useState([])
    const [LdataSource, setLdataSource] = useState([])
    const state = 1
    const lstate = 3
    const {_id,roleId:{roleType},region}  = JSON.parse(localStorage.getItem("token"))
    useEffect(()=>{
        const roleObj = {
            "1":"superadmin",
            "2":"admin",
            "3":"editor"
        }
        axios.get(`/news/aduit/${state}`).then(res => {
            const list = res.data
            setdataSource(roleObj[roleType]==="superadmin"?list:[
                ...list.filter(item=>item.userId === _id),
                ...list.filter(item=>item.region === region && roleObj[item.roleId.roleType]==="editor")
            ])
        })
        axios.get(`/work/${lstate}`).then(res => {
            const list = res.data
            setLdataSource(roleObj[roleType]==="superadmin"?list:[
                ...list.filter(item=>item.userId === _id),
                ...list.filter(item=>item.region === region && roleObj[item.roleId.roleType]==="editor")
            ])
        })
    },[roleType, region, _id])

    const Acolumns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title,item) => {
                return <a href={`#/news-manage/preview/${item._id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: "新闻分类",
            dataIndex: 'categoryId',
            render: (categoryId) => {
                return <div>{categoryId.title}</div>
            }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                   <Button type="primary" onClick={()=>handleAudit(item,2)}>通过</Button>&nbsp;&nbsp;
                   <Button danger onClick={()=>handleAudit(item,0)}>驳回</Button>
                </div>
            }
        }
    ]
    const Lcolumns = [
        {
            title: '请假人',
            dataIndex: 'username',
            render: (username) => {
                return <div>{username}</div>
            }
        },
        {
            title: '请假类型',
            dataIndex: 'categoryId',
            render: (categoryId) => {
                return <div>{categoryId.title}</div>
            }
        },
        {
            title: "请假原因",
            dataIndex: 'reason',
            render: (reason) => {
                return <div dangerouslySetInnerHTML={{
                    __html:reason
                }}></div>
            }

        },
        {
            title: "开始时间",
            dataIndex: 'leaveon',
            render: (leaveon) => {
                return <div>{leaveon}</div>
            }
        },
        {
            title: "结束时间",
            dataIndex: 'leaveoff',
            render: (leaveoff) => {
                return <div>{leaveoff}</div>
            }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                   <Button type="primary" onClick={()=>handleWork(item,4)}>通过</Button>&nbsp;&nbsp;
                   <Button danger onClick={()=>handleWork(item,5)}>驳回</Button>
                </div>
            }
        }
    ]

    const handleAudit = (item,auditState)=>{
        setdataSource(dataSource.filter(data=>data._id!==item._id))

        axios.patch(`/news/${item._id}`,{
            auditState
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                  `您可以到[审核管理-审核列表]中查看文章审核状态`,
                placement:"bottomRight"
            });
        })
    }

    const handleWork = (item,auditState)=>{
        setLdataSource(LdataSource.filter(data=>data._id!==item._id))

        axios.patch(`/work/${item._id}`,{
            auditState:auditState
        }).then(res=>{
            notification.info({ 
                message: `通知`,
                description:
                  `您可以到[请假信息列表]中查看您的请假条审核状态`,
                placement:"bottomRight"
            });
        })
    }

    return (
        <div>
                <Table dataSource={LdataSource} columns={Lcolumns}
                pagination={{
                    pageSize: 3
                }} 
                rowKey={item=>item._id}
                />

                <Table dataSource={dataSource} columns={Acolumns}
                pagination={{
                    pageSize: 3
                }} 
                rowKey={item=>item._id}
                />
        </div>
    )
}
