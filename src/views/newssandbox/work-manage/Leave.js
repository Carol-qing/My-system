import React, { useEffect, useState, useRef } from 'react'
import { Steps, Button, Form, Input, Select, message, DatePicker, notification } from 'antd'
import axios from 'axios'
import style from './Work.module.css'
import NewsEditor from '../../../components/news-manage/NewsEditor';
import { LeftOutlined } from '@ant-design/icons'
const { Option } = Select

export default function Leave(props) {
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [formInfo, setformInfo] = useState({})
  const [reason, setReason] = useState("")


  const User = JSON.parse(localStorage.getItem("token"))
  const handleNext = () => {
      if (current === 0) {
          // 校验
          NewsForm.current.validateFields().then(res => {
              setformInfo(res)
              setCurrent(current + 1)
          }).catch(error => {
              console.log(error)
          })
      } else {
          if (reason === "" || reason.trim() === "<p></p>") {
              message.error("内容不能为空")
          } else {
              setCurrent(current + 1)
          }
      }
  }
  const handlePrevious = () => {
      setCurrent(current - 1)
  }

  const item = [
    {
        title: '基本信息',
        description: '请假类型'
    },
    {
      title: '请假原因',
      description: '内容',
    },
    {
      title: '提交申请',
      description: '提交审核',
    },
  ]
  const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
  }

  const NewsForm = useRef(null)

  useEffect(() => {
      axios.get("/categories").then(res => {
          setCategoryList(res.data.filter(item => item.type === 3))
      })
  }, [])

  const config = {
    rules: [
      {
        type: 'object',
        required: true,
        message: 'Please select time!',
      },
    ],
  }

  // 保存进后端
  const handleSave = (auditState) => {
      axios.post('/work/leave', {
          ...formInfo,
          'userId':User._id,
          "roleId":User.roleId,
          "reason": reason,
          "region": User.region,
          "author": User.username,
          "auditState": auditState,
          "leaveon":formInfo['leaveon'].format('YYYY-MM-DD'),
          "leaveoff":formInfo['leaveoff'].format('YYYY-MM-DD')
      }).then(res=>{
          props.history.push(auditState===3?'/home':'/audit-manage/list')

          notification.info({
              message: `通知`,
              description:
                `申请请假成功！您可以到'审核列表'中查看您的提交`,
              placement:"bottomRight"
          });
      })
  }

  return (
      <div>
          <div style={{marginBottom: '14px'}}>
            <Button  
              type="link"
              value="large"
              icon={<LeftOutlined/>} 
              onClick={()=> props.history.goBack()}
            />&nbsp;&nbsp;
            <b style={{fontSize:'20px'}}>请假条</b>&nbsp;&nbsp;
          </div>

          <Steps current={current} items={item}/>

          <div style={{ marginTop: "50px" }}>
              <div className={current === 0 ? '' : style.active}>
                  <Form
                      {...layout}
                      name="basic"
                      ref={NewsForm}
                      initialValues={{
                        username: User.username
                      }}
                  >
                      <Form.Item
                          label="请假人"
                          name="username"
                          rules={[{ required: true, message: 'Please input your username!' }]}
                      >
                          <Input />
                      </Form.Item>

                      <Form.Item
                          label="请假类型"
                          name="categoryId"
                          rules={[{ required: true, message: 'Please input your username!' }]}
                      >
                          <Select>
                              {
                                  categoryList.map(item =>
                                      <Option value={item._id} key={item._id}>{item.title}</Option>
                                  )
                              }
                          </Select>
                      </Form.Item>

                      <Form.Item name="leaveon" label="开始时间" {...config}>
                        <DatePicker />
                      </Form.Item>

                      <Form.Item name="leaveoff" label="结束时间" {...config}>
                        <DatePicker />
                      </Form.Item>

                  </Form>
              </div>

              <div className={current === 1 ? '' : style.active}>
                  <NewsEditor getContent={(value) => {
                      setReason(value)
                  }}></NewsEditor>
              </div>
              <div className={current === 2 ? '' : style.active}></div>

          </div>
          <div style={{ marginTop: "50px" }}>
              {
                  current === 2 && <span>
                      <Button danger onClick={() => handleSave(3)}>提交审核</Button>&nbsp;&nbsp;
                  </span>
              }
              {
                  current < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>
              }

              {
                  current > 0 && <Button onClick={handlePrevious}>上一步</Button>
              }
          </div>
      </div>
  )
}
