import React, { useState, useEffect } from 'react'
import { Button, Table, Modal,notification} from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons'
const { confirm } = Modal
export default function NewsDraft(props) {
    const [dataSource, setdataSource] = useState([])

    const {_id,roleId:{roleType}}  = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`/news/${_id}`).then(res => {
            const list = res.data
            setdataSource(list)
        })
    }, [_id])

    const columns = [
        {
            title: '文章标题',
            dataIndex: 'title',
            render:(title,item)=>{
                return <a href={`#/news-manage/preview/${item._id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '分类',
            dataIndex: 'categoryId',
            render:(category)=>{
                return category.title
            }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                    &nbsp;&nbsp;
                    <Button shape="circle" icon={<EditOutlined />} onClick={()=>{
                        console.log('rr',item._id);
                        props.history.push(`/news-manage/update/${item._id}`)
                    }}/>
                    &nbsp;&nbsp;
                    <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={()=>handleCheck(item._id)}/>
                </div>
            }
        }
    ];


    const handleCheck = (id)=>{
        axios.patch(`/news/${id}`,{
            auditState:1
        }).then(res => {
            if(roleType === 1 ||roleType === 2){
                props.history.push('/audit-manage/list')
            }else {
                props.history.push('/home')
            }
            notification.info({
                message: `通知`,
                description:
                  `您可以到【'审核列表'】中查看您的文章`,
                placement:"bottomRight"
            });
        })
    }

    const confirmMethod = (item) => {
        confirm({
            title: '你确定要删除?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
                deleteMethod(item)
            }
        });

    }
    //删除
    const deleteMethod = (item) => {
        // 当前页面同步状态 + 后端同步
        setdataSource(dataSource.filter(data => data._id !== item._id))
        axios.delete(`/news/${item._id}`)
    }

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
