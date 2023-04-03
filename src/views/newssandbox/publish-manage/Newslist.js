import React, { useEffect, useState } from 'react'
import {Table} from 'antd'
import axios from 'axios'

export default function NewList() {
    const [dataSource, setdataSource] = useState([])
    // const {username,roleId:{roleType}, region} = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`/news`).then(res => {
            setdataSource(res.data)
        })
    }, [])


    const columns = [
        {
            title: '文章标题',
            dataIndex: 'title',
            render: (title,item) => {
                return <a href={`#/news-manage/preview/${item._id}`}>{title}</a>
            }
        },
        {
            title: '部门',
            dataIndex: 'region'
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: "文章分类",
            dataIndex: 'categoryId',
            render: (category) => {
                return <div>{category.title}</div>
            }
        },
        // {
        //     title: "审核状态",
        //     dataIndex: 'auditState',
        //     render: (auditState) => {
        //         const colorList = ["",'orange','green','red']
        //         const auditList = ["草稿箱","审核中","已通过","未通过"]
        //         return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
        //     }
        // },
    ]

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
