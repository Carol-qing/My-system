import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer, Modal } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios'
import * as Echarts from 'echarts' 
import _ from 'lodash' //把数据分类groupBy方法
import UserForm from '../../../components/user-manage/UserForm'
import { useMemo } from 'react';

const { Meta } = Card;

export default function Home() {
    const { _id, username, region, roleId: { roleName },roleId } = JSON.parse(localStorage.getItem("token"))
    const [viewList, setviewList] = useState([])
    const [starList, setstarList] = useState([])
    const [allList, setallList] = useState([])
    const [msg, setMsg] = useState('')
    const [visible, setvisible] = useState(false)
    const [isUpdateVisable, setisUpdateVisable] = useState(false)
    const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
    const [roleList, setroleList] = useState([])
    const [regionList, setregionList] = useState([])
    const [pieChart, setpieChart] = useState(null)
    const [load,setLoad] = useState(false)
    const barRef = useRef()
    const pieRef = useRef()
    const newRef = useRef()
    const updateForm = useRef(null)

    useEffect(() => {
        axios.get("/news").then(res => {
            setviewList(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get("/news/homelist").then(res => {
            setstarList(res.data)
            // console.log(_.groupBy(res.data,item=>item.categoryId.title));
        })
    }, [])

    useEffect(() => {
        axios.get("/users").then(res => {
            // 把分类好的数据放进echart
            console.log('r',res.data);
            renderBarView(_.groupBy(res.data, item => item.region))
            setallList(res.data)
            setMsg(res.data.filter(item => item._id === _id))
        })
        return () => {
            window.onresize = null
        }
    }, [_id, load])

    useEffect(() => {
        axios.get("/news/elist").then(res => {
            // 把分类好的数据放进echart
            renderNewView(_.groupBy(res.data, item => item.categoryId.title))
            setallList(res.data)
        })
        return () => {
            window.onresize = null
        }
    }, [])

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

    const renderNewView = (obj) => {
        var myChart = Echarts.init(newRef.current);

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '文章分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: "45",
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [{
                name: '数量',
                type: 'bar',
                data: Object.values(obj).map(item => item.length)
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);


        window.onresize = () => {
            myChart.resize()
        }
    }

    const renderBarView = (obj) => {
        var myChart = Echarts.init(barRef.current);

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '各部门人数分类图示'
            },
            tooltip: {},
            legend: {
                data: ['人数']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: "45",
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [{
                name: '人数',
                type: 'bar',
                data: Object.values(obj).map(item => item.length)
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);


        window.onresize = () => {
            myChart.resize()
        }
    }

    const renderPieView = (obj) => {
        //数据处理工作
        var currentList =allList.filter(item=>item._id===_id)
        var groupObj = _.groupBy(currentList,item=>item.categoryId.title)
        var list = []
        for(var i in groupObj){
            list.push({
                name:i,
                value:groupObj[i].length
            })
        }
        var myChart;
        if(!pieChart){
            myChart = Echarts.init(pieRef.current);
            setpieChart(myChart)
        }else{
            myChart = pieChart
        }
        var option;

        option = {
            title: {
                text: '当前用户文章分类图示',
                // subtext: '纯属虚构',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);

    }

    const updateFormOK = () => {
        updateForm.current.validateFields().then(value => {
          setisUpdateVisable(false)
          setisUpdateDisabled(!isUpdateDisabled)

          axios.patch(`/users/${_id}`,
          value).then(r =>{
            setLoad(!load)
          })
        })
    }

    const handleUpdate = () => {
        // 取消禁用
        setisUpdateDisabled(false)
        // 设置初始值
        updateForm.current.setFieldsValue({
            username:msg[0].username,
            password:msg[0].password,
            region,
            roleId:roleId._id
        })
    }
    const nameChange = useMemo(() => {
        console.log('s',msg[0])
        if (msg) {
            return msg[0].username
        }else {
            console.log('777');
            return username
        }
    }, [msg, username])

    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={() => {
                                // setTimeout(() => {
                                    setvisible(true)
                                    // init初始化
                                //     renderPieView()
                                // }, 0)
                                // 新建一个promise对象
                                let newPromise = new Promise((resolve) => {
                                    resolve()
                                })
                                //然后异步执行echarts的初始化函数
                                newPromise.then(() => {
                                    //	此dom为echarts图标展示dom
                                    renderPieView()
                                })
                            }} />,
                            <EditOutlined key="edit" onClick={() =>{
                                setisUpdateVisable(true)
                                let newPromise = new Promise((resolve) => {
                                    resolve()
                                })
                                newPromise.then(() => {
                                    handleUpdate()
                                })
                                
                            }}/>,
                            <EllipsisOutlined key="ellipsis" />,

                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={nameChange}
                            description={
                                <div>
                                    <b>{region}</b>
                                    <span style={{
                                        paddingLeft: "30px"
                                    }}>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="公告栏" bordered={true}>
                        <List
                            size="small"
                            // bordered
                            dataSource={starList}
                            renderItem={item => <List.Item>
                                <a href={`#/news-manage/preview/${item._id}`}>{item.title}</a>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            size="small"
                            // bordered
                            dataSource={viewList}
                            renderItem={item => <List.Item>
                                <a href={`#/news-manage/preview/${item._id}`}>{item.title}</a>
                            </List.Item>}
                        />
                    </Card>
                </Col>
            </Row>
            <Drawer
                width="500px"
                title="个人文章分类"
                placement="right"
                closable={true}
                onClose={() => {
                    setvisible(false)
                }}
                open={visible}
            >
                <div ref={pieRef} style={{
                    width: '100%',
                    height: "400px",
                    marginTop: "30px"
                }}></div>
            </Drawer>
            <Row gutter={16}>
                <Col span={12}>
                    <div ref={barRef} style={{
                        width: '100%',
                        height: "360px",
                        marginTop: "40px"
                    }}></div>
                </Col>
                <Col span={12}>
                    <div ref={newRef} style={{
                        width: '100%',
                        height: "360px",
                        marginTop: "40px"
                    }}></div>
                </Col>
            </Row>

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
