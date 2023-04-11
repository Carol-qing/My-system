import React, { useEffect, useState } from 'react'
import {Table,Tag} from 'antd'
import axios from 'axios'
export default function AuditList(props) {
    const [dataSource, setdataSource] = useState([])
    const {_id,roleId:{roleType}, region} = JSON.parse(localStorage.getItem("token"))
    useEffect(()=>{
      // auditState_ne：jsonserver中表示不等于0；_lte：小于等于
        axios.get(`/news/list/${_id}/${roleType}/${region}`).then(res=>{
            setdataSource(res.data)
        })
    },[_id,roleType,region])


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

    // 撤销操作，存进草稿箱
    // const handleRervert = (item)=>{
    //     setdataSource(dataSource.filter(data=>data._id!==item._id))

    //     axios.patch(`/news/${item._id}`,{
    //         auditState:0
    //     }).then(res=>{
    //         notification.info({
    //             message: `通知`,
    //             description:
    //               `您可以到草稿箱中查看您的文章`,
    //             placement:"bottomRight"
    //         });
  
    //     })
    // }

    // 更新操作
    // const handleUpdate = (item)=>{
    //   // 往更新路径跳转
    //     props.history.push(`/news-manage/update/${item._id}`)
    // }

    // 发布操作
    // const handlePublish = (item)=>{
    //     axios.patch(`/news/${item._id}`).then(res=>{
    //         props.history.push('/publish-manage/published')

    //         notification.info({
    //             message: `通知`,
    //             description:
    //               `您可以到【发布管理/已经发布】中查看您的文章`,
    //             placement:"bottomRight"
    //         });
    //     })
    // }

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
