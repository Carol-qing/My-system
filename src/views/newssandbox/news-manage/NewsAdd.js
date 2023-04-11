import React, { useEffect, useState, useRef } from 'react'
import { Steps, Button, Form, Input, Select, message,notification } from 'antd'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor';
import { LeftOutlined } from '@ant-design/icons'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { Option } = Select;

export default function NewsAdd(props) {
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])

    const [formInfo, setformInfo] = useState({})
    const [content, setContent] = useState("")
    const time = moment().format('YYYY-MM-DD HH:mm')

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
            if (content === "" || content.trim() === "<p></p>") {
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
            description: '文章标题，文章分类'
          },
          {
            title: '文章内容',
            description: '文章主体内容',
            subTitle: 'Left 00:00:08',
          },
          {
            title: '文章提交',
            description: '草稿箱或提交审核',
          },
    ]
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    }

    const NewsForm = useRef(null)

    useEffect(() => {
        axios.get("/categories").then(res => {
            if (User.roleId.roleType === 1){
                setCategoryList(res.data.filter(item => item.type !== 3))
            }else {
                setCategoryList(res.data.filter(item => item.type === 2))
            }
        })
    }, [User])

    // 保存进后端
    const handleSave = (auditState) => {
        axios.post('/news', {
            ...formInfo,
            "userId": User._id,
            "content": content,
            "region": User.region,
            "author": User.username,
            "roleId": User.roleId._id,
            "auditState": auditState,
            "createTime": time,   
        }).then(res=>{
            props.history.push(auditState===0?'/news-manage/draft':'/audit-manage/list')

            notification.info({
                message: `通知`,
                description:
                  `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的提交状态`,
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
              <b style={{fontSize:'20px'}}>撰写文章</b>&nbsp;&nbsp;
              <span>This is a subtitle</span>
            </div>

            <Steps current={current} items={item}/>
                


            <div style={{ marginTop: "50px" }}>
                <div className={current === 0 ? '' : style.active}>
                    <Form
                        {...layout}
                        name="basic"
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="文章标题"
                            name="title"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="文章分类"
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

                    </Form>
                </div>

                <div className={current === 1 ? '' : style.active}>
                    <NewsEditor getContent={(value) => {
                        setContent(value)
                    }}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : style.active}></div>

            </div>
            <div style={{ marginTop: "50px" }}>
                {
                    current === 2 && <span>
                        <Button type="primary" onClick={() => handleSave(0)}>保存草稿箱</Button>&nbsp;&nbsp;
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>&nbsp;&nbsp;
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
