import React, { useEffect, useState } from 'react'
import { Descriptions, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons'
import './News.module.css'
import moment from 'moment'
import axios from 'axios';

moment.suppressDeprecationWarnings = true

export default function NewsPreview(props) {
    const [newsInfo, setnewsInfo] = useState(null)
    const outputDateFormat = 'YYYY-MM-DD';
    useEffect(() => {
        // 根据用户id查询
        axios.get(`/news/preview/${props.match.params.id}`).then(res => {
            setnewsInfo(res.data)
        })
    }, [props.match.params.id])

    const auditList = ["未审核", '审核中', '已通过', '未通过']
    // const publishList = ["未发布", '待发布', '已上线', '已下线']

    const colorList = ["red","black","orange","green","red"]
    return (
        <div>
            {
                newsInfo && <div className='news-preview'>
                    <div style={{marginBottom: '14px'}}>
                        <Button  
                            type="link"
                            value="large"
                            icon={<LeftOutlined/>} 
                            onClick={()=> window.history.back()}
                        />&nbsp;&nbsp;
                        <b style={{fontSize:'20px'}}>{newsInfo.title}</b>&nbsp;&nbsp;
                        <span>{newsInfo.categoryId.title}</span>
                    </div>
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format(outputDateFormat)}</Descriptions.Item>
                        {/* <Descriptions.Item label="发布时间">{
                            newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-"
                        }</Descriptions.Item> */}
                        <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                        <Descriptions.Item label="审核状态" ><span style={{ color: colorList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
                        {/* <Descriptions.Item label="发布状态" ><span style={{ color: colorList[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</span></Descriptions.Item> */}
                        <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                        {/* <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item> */}
                        {/* <Descriptions.Item label="评论数量">0</Descriptions.Item> */}
                    </Descriptions>

                    <div dangerouslySetInnerHTML={{
                        __html:newsInfo.content
                    }} style={{
                        margin:"4px", 
                        border:"1px solid gray", 
                        paddingLeft: '8px',
                        overflowY: 'scroll',
                        height: '665px'
                        }}>
                    </div>
                </div>
            }
        </div>
    )
}
