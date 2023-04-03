import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch} from 'antd'
import axios from 'axios'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'

const { confirm } = Modal
export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [isAddVisable, setisAddVisable] = useState(false)
  const [isUpdateVisable, setisUpdateVisable] = useState(false)
  const [roleList, setroleList] = useState([])
  const [regionList, setregionList] = useState([])
  const [current, setCurrent] = useState(null)
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
  const [load,setLoad] = useState(false)

  const addForm = useRef(null)
  const updateForm = useRef(null)

  const {roleId:{roleType},region,username} = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
    const roleObj = {
      "1":"superadmin",
      "2":"admin",
      "3":"editor"
    }
    axios.get("/users").then(res => {
      const list = res.data
      setDataSource(roleObj[roleType]==="superadmin"?list:[
        ...list.filter(item=>item.username!==username && item.region===region),
        // ...list.filter(item=>item.region===region && roleObj[item.roleType] === "editor")
      ])
    })
  },[roleType,region,username,load])
  useEffect(() => {
    axios.get("/regions").then(res => {
      setregionList(res.data)
    })
  },[])
  useEffect(() => {
    axios.get("/roles").then(res => {
      setroleList(res.data)
    })
  },[])

  const columns = [
    {
      title: '部门',
      key:'region',
      dataIndex: 'region',
      render:(region) => {
        return <b>{region==="" ? '总部' : region}</b>
      }
    },
    {
      title: '角色名称',
      key:'role',
      dataIndex: 'roleId',
      render:(roleId) => {
        return roleId?.roleName
      }
    },
    {
      title: '用户名',
      key: 'username',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      key: 'roleState',
      dataIndex: 'roleState',
      render:(roleState,item) => {
        return <Switch 
        checked={roleState} disabled={item.default}
        onChange={() => handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      key:"caozuo",
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined/>} 
          onClick={() => showConfirm(item)} disabled={item.default}/>
          &nbsp;&nbsp;
          <Button 
            type='primary' 
            shape='circle' 
            icon={<EditOutlined />} 
            disabled={item.default}
            onClick={() => handleUpdate(item)}
          />
        </div>
      }
    }
  ]

  const handleUpdate = async(item) => {
    // 同步触发
    // setTimeout(() => {
      await setisUpdateVisable(true)
      if(item.roleType === '1'){
        // 禁用
        setisUpdateDisabled(true)
      }else {
        // 取消禁用
        setisUpdateDisabled(false)
      }
      const {username, password, region, roleId:{ _id }} = item
      // 设置初始值
      updateForm.current.setFieldsValue({
        username,
        password,
        region,
        roleId:_id
      })
    // }, 0)
    setCurrent(item)
  }
  const handleChange = (item) => {
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`/users/${item._id}`,{
      roleState:item.roleState
    })
  }

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
      setDataSource(dataSource.filter(data => data._id!== item._id))
      axios.delete(`/users/${item._id}`)
  }

  const addFormOK = async() => {
    addForm.current.validateFields().then(value => {
      setisAddVisable(false)
      // form重置
      addForm.current.resetFields()

      // 从post到后端自增长生成id，再设置dataSource,方便后面的的删除和更新处理
      axios.post(`/users`,{
        ...value,
        "headImgUrl": 'https://cn.bing.com/images/search?view=detailV2&ccid=x1DEx6J9&id=BDCDBFA4F5A513D4AFEDB250DF788E8F26E00EB7&thid=OIP.x1DEx6J9SNwpo8_8GktC9gAAAA&mediaurl=https%3a%2f%2ftupian.qqw21.com%2farticle%2fUploadPic%2f2020-3%2f202031217411359622.jpg&exph=400&expw=400&q=%e5%a4%b4%e5%83%8f&simid=608023397967855801&FORM=IRPRST&ck=F120E244FD71204D2AA516F98316F45E&selectedIndex=199',
        "roleState": true,
        "default": false,
      }).then(res=>{
        setDataSource([...dataSource, {
          ...res.data,
          role:roleList.filter(item=>item===value.roleId)[0],
        }])
        setLoad(!load)
      }).catch(err=>{
        console.log(err);
      })
    })
  }
  const updateFormOK = () => {
    updateForm.current.validateFields().then(value => {
      setisUpdateVisable(false)

      setDataSource(dataSource.map(item=>{
        if(item._id===current._id){
          return {
            ...item,
            ...value,
            role:roleList.filter(data=>data._id===value.roleId)[0]
          }
        }
        return item
      }))
      setisUpdateDisabled(!isUpdateDisabled)
      axios.patch(`/users/${current._id}`,
      value).then(r=>{
        setLoad(!load)
      })
    })
  }

  return (
    <div>
      <Button type='primary' onClick={() => {
        setisAddVisable(true)
      }}>添加用户</Button>
      <Table 
        dataSource={dataSource} 
        columns={columns} 
        pagination={{
          pageSize:5
        }}
        rowKey={item => item._id}
      />


      <Modal
        open={isAddVisable}
        title="添加用户信息"
        okText="确定"
        cancelText="取消"
        onCancel={() => setisAddVisable(false)}
        onOk={() => addFormOK()}
      >
        <UserForm 
          regionList={regionList} 
          roleList={roleList}
          ref={addForm}
        />
      </Modal>

      <Modal
        open={isUpdateVisable}
        title="编辑用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setisUpdateVisable(false)
          setisUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => updateFormOK()}
      >
        <UserForm 
          regionList={regionList} 
          roleList={roleList}
          ref={updateForm}
          isUpdateDisabled={isUpdateDisabled}
          isUpdate={true}
        />
      </Modal>
    </div>
  )
}
