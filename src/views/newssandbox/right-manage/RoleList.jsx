import { Table, Button,  Modal, Tree } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  BarsOutlined,
} from '@ant-design/icons'
import axios from 'axios'
import React, { useState, useEffect } from 'react'

const { confirm } = Modal;

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [rightList, setRightList] = useState([])
  const [currenRights, setCurrenRights] = useState([])
  const [currenId, setCurrenId] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    axios.get('/roles').then(res => {
      setDataSource(res.data)
    })
  },[])

  useEffect(() => {
    axios.get('/rights').then(res => {
      setRightList(res.data)
    })
  },[])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'roleType',
      render:(id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined/>}
          onClick={() => showConfirm(item)} />
          &nbsp;&nbsp;
          <Button 
            type='primary' 
            shape='circle' 
            icon={<EditOutlined />} 
            onClick={() => {
              setIsModalOpen(true)
              // 非受控组件
              setCurrenRights(item.rights)
              setCurrenId(item._id)
            }}
          />
        </div>
      }
    },
  ]

  const showConfirm = (item) => {
    confirm({
      title: '你确定要删除?',
      icon: <BarsOutlined />,
      // content: 'Some descriptions',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      }
    })
  }
  // 删除
  const deleteMethod = (item) => {
      setDataSource(dataSource.filter(data => data._id !== item._id))
      axios.delete(`/roles/${item._id}`)
  }

  const handleOk = () => {
    setIsModalOpen(false);
    // 同步后端数据
    setDataSource(dataSource.map(item=> {
      if(item._id === currenId){
        return {
          ...item,
          rights: currenRights
        }
      }
      return item
    }))

    axios.patch(`/roles/${currenId}`,{
      rights: currenRights
    })
  }
  const handleCancel = () => {
    setIsModalOpen(false);
  }

  const onCheck = (checkKeys)=> {
  // 将非受控组件改变成受控组件才能改变值
    setCurrenRights(checkKeys.checked)
  }

  return (
    <div>
      <Table 
        dataSource={dataSource} 
        columns={columns}
        rowKey={(item)=>item._id}
      ></Table>

      <Modal title="设置权限" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkedKeys={currenRights}
          checkStrictly = {true}
          onCheck={onCheck}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
