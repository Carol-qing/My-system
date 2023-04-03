import React, {useEffect, useState,useRef} from 'react'
import { Calendar, Button, Modal, Alert, Steps, Row, Col,message } from 'antd'
import axios from 'axios'
import * as Echarts from 'echarts' 
import _ from 'lodash' //把数据分类groupBy方法
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');


export default function Record() {
  const [current, setCurrent] = useState(0)
  const [isVisabled, setisVisabled] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const [onbtndisabled, setOnBtnDisabled] = useState(false)
  const [offbtndisabled, setOffBtnDisabled] = useState(false)
  const [talllist, setTallList] = useState([])
  const [load,setLoad] = useState(false)

  const [pieChart, setpieChart] = useState(null)
  const date =  moment().format('YYYY-MM-DD')
  const time = moment().format('HH:mm')
  const pieRef = useRef()
  const barRef = useRef()

  const {_id} = JSON.parse(localStorage.getItem("token"))
  const recordList = ["打卡失败","正常","迟到","缺勤"]
    
    useEffect(() =>{
      axios.get(`/record/${date}/${_id}`)
      .then(res => {
        if(res.data){
          if(res.data.workonState === 0){
            setOnBtnDisabled(false)
          }else {
            setOnBtnDisabled(true)
            setCurrent(1)
          }
          if(res.data.workoffState === 0){
            setOffBtnDisabled(false)
          }else{
            setOffBtnDisabled(true)
            setCurrent(2)
          }
        }
        })
    },[_id, date,load])

    useEffect(() => {
      axios.get(`/record/${_id}`).then(res => {
        renderBarView(_.groupBy(res.data, item => item.workonState))
        setTallList(res.data)
      })
      return () => {
          window.onresize = null
      }
    }, [_id, load])

    // 新建一个promise对象
    let newPromise = new Promise((resolve) => {
    resolve()
    })
    //然后异步执行echarts的初始化函数
    newPromise.then(() => {
        //	此dom为echarts图标展示dom
        renderPieView()
    })

    const renderBarView = (obj) => {
      var myChart = Echarts.init(barRef.current);

      // 指定图表的配置项和数据
      var option = {
          title: {
              text: '出勤数据统计'
          },
          tooltip: {},
          legend: {
              data: ['状态']
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
              name: '次数',
              type: 'bar',
              data: Object.values(obj).map(item => item.length)
          }]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);


      window.onresize = () => {
          // console.log("resize")
          myChart.resize()
      }
    }
    const renderPieView = () => {
      //数据处理工作
      var obj = _.groupBy(talllist,item=>recordList[item.workonState])
      var list = []
      for(var i in obj){
          list.push({
              name:i,
              value:obj[i].length
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
              text: '个人出勤情况图示',
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
                  name: '次数',
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
      }

      option && myChart.setOption(option)

    }

    const onPanelChange = (value, mode) => {
      console.log(value.format('YYYY-MM-DD'), mode);
      // console.log(moment(value).format('YYYY-MM-DD HH:mm:ss')+"&&&"+mode)
    }
    const attendanceBtn = () => {
      setisVisabled(true)
    }

    /**
     * @param startT { string } 上班时间 "HH:mm"
     * @param workonTime { string } 打卡时间 "HH:mm"
     * @param onState { string } 上班状态 "HH:mm"
     * 0为未打卡，1为打卡成功，2为打卡迟到，3为缺勤
     */
    const workonOk = (item) => {
      let startT = moment("09:00", "HH:mm");
      let midT = moment("10:00", "HH:mm");
      let workonTime = moment(item, "HH:mm");
      let onState = workonTime.isAfter(startT, "hours"); //如果上班时间晚于九点,迟到状态2
      let midState = workonTime.isAfter(midT, "hours"); //如果上班时间晚于十点,缺勤状态3
      if(onState && midState){
        // console.log('缺勤')
        messageApi.open({
          type: 'warning',
          content: '打卡失败，当前状态为缺勤！',
        });
        axios.post('/record',{
          'userId':_id,
          'date':date,
          'workon': workonTime,
          'workoff': '',
          'workonState': 3
        }).then(() =>{
          setLoad(!load)
        })
      }else if(onState) {
        // console.log('迟到了,填写迟到原因')
        messageApi.open({
          type: 'warning',
          content: '打卡成功,当前状态为迟到',
        });
        axios.post('/record',{
          'userId':_id,
          'date':date,
          'workon': workonTime,
          'workoff': '',
          'workonState': 2
        }).then(() =>{
          setLoad(!load)
        })
      }else{
        // console.log('上班打卡成功')
        messageApi.open({
          type: 'success',
          content: '上班打卡成功！',
        });
        axios.post('/record',{
          'userId':_id,
          'date':date,
          'workon': workonTime,
          'workoff': '',
          'workonState': 1
        }).then(() =>{
          setLoad(!load)
        })
      }
      setOnBtnDisabled(true)
      setCurrent(1)
    }

    /**
     * @param endT { string } 下班时间 "HH:mm"
     * @param workoffTime { string } 签退时间 "HH:mm"
     * @param offState { string } 下班状态 "HH:mm"
     * 0为未签退，1为签退成功，2为签退失败
     */
    const workoffOk = (item) => {
      let endT = moment("18:00", "HH:mm");
      let workoffTime = moment(item, "HH:mm");
      let offState = workoffTime.isBefore(endT, "hours");//如果下班时间早于18点，早退状态
        if(offState){
          // console.log('还没到下班时间')
          // setOffBtnDisabled(true)
          messageApi.open({
            type: 'warning',
            content: '早退提示：当前未到签退时间！',
            style: {
              marginTop: '20vh',
            },
          })
          // axios.patch(`/record/${date}/${_id}`,{
          //   'workoff': workoffTime,
          //   'workoffState': 2
          // })
        }else {
          messageApi.open({
            type: 'success',
            content: '签退成功!',
          });
          axios.patch(`/record/${date}/${_id}`,{
            'workoff': workoffTime,
            'workoffState': 1
          }).then(() =>{
            setLoad(!load)
          })
          setOffBtnDisabled(true)
          setCurrent(2)
        }

    }


    const attendanceCancel = () => {
      setisVisabled(false)
    }

    return (
      <div>
        {contextHolder}
        <Row>
          <Col span={12}>
            <Button type="primary" onClick={attendanceBtn}>考勤打卡</Button>
            <div ref={pieRef} style={{
              width: '100%',
              height: "400px",
              marginTop: "20px"
            }}></div>
            <div ref={barRef} style={{
              width: '100%',
              height: "350px",
              marginTop: "20px"
            }}></div>
          </Col>
          <Col span={12}>
            <Calendar 
              onPanelChange={onPanelChange}
            />
          </Col>
        </Row>
       
        <Modal title = "考勤打卡"
          open={isVisabled}
          onCancel={attendanceCancel}
          footer={[// 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
          <Button key="back" type="primary" onClick={attendanceCancel}>关闭</Button>,
          ]}
          >
          <Alert message="每天记得打卡哦！" type="info" style={{marginTop:10,marginBottom:20}} showIcon/>
          <Steps  
            current={current}
            style={{marginTop:10,marginBottom:20}}
            items={[
              {
                title: '上班打卡',
                description: "上班时间09:00" ,
              },
              {
                title: '下班打卡',
                description: "下班时间17:30",
              }
            ]}
          />
          <Row>
            <Col span={12}>
              <Button 
                type="primary" 
                shape="round"
                size='small'
                disabled={onbtndisabled}
                onClick={() =>{workonOk(time)}} 
                style={{marginTop:10,marginBottom:20,height:40,fontWeight:"bolder"}} 
                block
              > 打卡</Button>
            </Col>
            <Col span={12}>
            <Button 
              type="primary" 
              shape="round"
              size='middle'
              disabled={offbtndisabled}
              onClick={() =>{workoffOk(time)}} 
              style={{marginTop:10,marginBottom:20,height:40,fontWeight:"bolder"}} 
              block
            > 签退
          </Button>
            </Col>
          </Row>
        </Modal>
      </div>
    )
}
