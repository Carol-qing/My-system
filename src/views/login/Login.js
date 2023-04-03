import React from 'react'
import { Button, Form, Input, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css'
import axios from 'axios'

export default function Login(props) {
  const onFinish = (values) => {
    // 用户名密码存在且角色状态为真,包括可访问路径权限
      axios.get(`/login?username=${values.username}&password=${values.password}`)
      .then(res => {
        if(res.data.code === 0) {
          localStorage.setItem("token",JSON.stringify(res.data.doc))
          props.history.push("/")
        }else if(res.data.code === 1){
          message.error(res.data.err)
        }
      }) 
      .catch(err =>{
        message.error(err)
      })

  }

  return (
    <div style={{background:'rgb(35, 39, 65)', height:'100%', overflow:'hidden' }}>
      <div className='formContainer'>
        <div className='logintitle'>基于React的智能人事管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入您的用户名!' }]}
          >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                type="text"
                placeholder="请输入您的用户名"
              />
          </Form.Item>
          <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入您的密码!' }]}
          >
              <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="请输入您的密码"
              />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
