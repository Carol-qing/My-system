import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import axios from 'axios'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'

const { confirm } = Modal;
export default function RightList() {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get("/rights").then(res => {
      const list = res.data
      list.forEach(item  => {
        if(item.children.length === 0) {
          item.children =""
        }
      })
      setDataSource(list)
    })
  },[])

  const showConfirm = (item) => {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      }
    })
  }

  const deleteMethod = (item) => {
    // 前后端数据同步
    if(item.grade === 1) {
      setDataSource(dataSource.filter(data => data._id !== item._id))
      axios.delete(`/rights/${item._id}`)
    }else {
      let list = dataSource.filter(data =>data._id === item.rightId)
      list[0].children = list[0].children.filter(data=>data._id!==item._id)
      setDataSource([...dataSource])
      axios.delete(`/children/${item._id}`)
    }
  }

  const switchMethod = (item) => {
    item.pagepermisson = !item.pagepermisson
    setDataSource([...dataSource])
    if(item.grade === 1) {
      axios.patch(`/rights/${item._id}`, {
        pagepermisson: item.pagepermisson
      })
    }else if(item.grade === 2) {
      axios.patch(`/children/${item._id}`, {
        pagepermisson: item.pagepermisson
      })
    }
  }
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined/>} 
          onClick={() => showConfirm(item)} />
          &nbsp;&nbsp;
          <Popover
            content={<div style={{textAlign:'center'}}>
              <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)}></Switch>
            </div>}
            title="页面配置项"
            trigger={item.pagepermisson === undefined ? '' : 'click'}
          >
            <Button 
              type='primary' 
              shape='circle' 
              icon={<EditOutlined />} 
              disabled={item.pagepermisson === undefined}
            />
          </Popover>
        </div>
      }
    }
  ]

  return (
    <div>
      <Table 
        dataSource={dataSource} 
        columns={columns} 
        pagination={{
          pageSize:5
        }}
      />
    </div>
  )
}
