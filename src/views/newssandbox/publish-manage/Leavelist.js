import React, { useEffect, useState } from 'react'
import {Table,Tag} from 'antd'
import axios from 'axios'

export default function LeaveList() {
    const [dataSource, setdataSource] = useState([])
    const {username,roleId:{roleType}, region} = JSON.parse(localStorage.getItem("token"))
    useEffect(()=>{
        axios.get(`/work/list/${username}/${roleType}/${region}`).then(res=>{
            setdataSource(res.data)
        })
    },[username,roleType,region])

    const columns = [
        {
            title: '请假人',
            dataIndex: 'username'
        },
        {
            title: '请假类型',
            dataIndex: 'categoryId',
            render: (item) => {
                return <div>{item.title}</div>
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
            title: "审核状态",
            dataIndex: 'auditState',
            render: (auditState) => {
                const colorList = ["",'orange','','orange','green','red']
                const auditList = ["草稿箱","审核中","已通过","审核中","已通过","未通过"]
                return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            }
        },
    ];

    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }} 
                
                rowKey={item=>item._id}
                />
        </div>
    )
}
