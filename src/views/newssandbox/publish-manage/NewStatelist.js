import React, { useEffect, useState } from 'react'
import {Table,Tag} from 'antd'
import axios from 'axios'
export default function Sunset() {
    const [dataSource, setdataSource] = useState([])
    const {_id} = JSON.parse(localStorage.getItem("token"))
    useEffect(()=>{
      // auditState_ne：jsonserver中表示不等于0；_lte：小于等于
        axios.get(`/news/statelist/${_id}`).then(res=>{
            setdataSource(res.data)
        })
    },[_id])


    const columns = [
        {
            title: '文章标题',
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
            title: "文章分类",
            dataIndex: 'categoryId',
            render: (category) => {
                return <div>{category.title}</div>
            }
        },
        {
            title: "审核状态",
            dataIndex: 'auditState',
            render: (auditState) => {
                const colorList = ["",'orange','green','red']
                const auditList = ["草稿箱","审核中","已通过","未通过"]
                return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            }
        },
        // {
        //     title: "操作",
        //     render: (item) => {
        //         return <div>
        //             {
        //                 item.auditState===1 &&  <Button onClick={()=>handleRervert(item)} >撤销</Button>
        //             }
        //             {
        //                 item.auditState===2 &&  <Button  danger onClick={()=>handlePublish(item)}>发布</Button>
        //             }
        //             {
        //                 item.auditState===3 &&  <Button type="primary" onClick={()=>handleUpdate(item)}>更新</Button>
        //             }
        //         </div>
        //     }
        // }
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
