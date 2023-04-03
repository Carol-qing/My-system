import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'

const { Option } = Select

const UserForm = forwardRef((props,ref) => {
  const [isDisabled, setisDisabled] = useState(false)

  useEffect(() => {
    setisDisabled(props.isUpdateDisabled)
  },[props.isUpdateDisabled])

  const {roleId:{roleType},region} = JSON.parse(localStorage.getItem("token"))
  const roleObj = {
    "1":"superadmin",
    "2":"admin",
    "3":"editor"
  }
  const checkRegionDisabled = (item)=>{
    if(props.isUpdate){
        if(roleObj[roleType]==="superadmin"){
            return false
        }else{
            return true
        }
    }else{
        if(roleObj[roleType]==="superadmin"){
            return false
        }else{
            return item.value!==region
        }
    }
  }

  const checkRoleDisabled = (item)=>{
      if(props.isUpdate){
          if(roleObj[roleType]==="superadmin"){
              return false
          }else{
              return true
          }
      }else{
          if(roleObj[roleType]==="superadmin"){
              return false
          }else{
              return roleObj[item.roleType]!=="editor"
          }
      }
  }

  return (
    <div>
      <Form
        ref={ref}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: '必填项',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: '必填项',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="region"
          label="区域"
          rules={isDisabled?[]:[{ required: true, message: 'Please input the title of collection!' }]}
        >
          <Select disabled={isDisabled}>
            {
              props.regionList.map(item => {
                return <Option value={item.value} key={item._id} 
                disabled={checkRegionDisabled(item)}>{item.title}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
            name="roleId"
            label="角色"
            rules={[ 
              {
                required: true,
                message: '必填项',
              },
            ]}
          >
            <Select onChange={(value) => {
              if(value === '63f0c9689b41be58a43f4228') {
                setisDisabled(true)
                ref.current.setFieldsValue({
                  region:"总部"
                })
              }else {
                setisDisabled(false)
              }
            }}>
              {
                props.roleList.map(item => {
                  return <Option value={item._id} key={item._id}
                    disabled={checkRoleDisabled(item)}> {item.roleName}</Option>
                })
              }
            </Select>
        </Form.Item>
      </Form>
    </div>
  )
})

export default UserForm