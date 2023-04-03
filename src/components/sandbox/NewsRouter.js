import React, { useEffect, useState } from 'react'
import Home from '../../views/newssandbox/home/Home'
import Nopermission from '../../views/newssandbox/nopermission/index'
import RightList from '../../views/newssandbox/right-manage/RightList'
import RoleList from '../../views/newssandbox/right-manage/RoleList'
import UserList from '../../views/newssandbox/user-manage/UserList'
import { Switch, Route, Redirect } from 'react-router-dom'
import NewsAdd from '../../views/newssandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/newssandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/newssandbox/news-manage/NewsCategory'
import Audit from '../../views/newssandbox/audit-manage/Audit'
import AuditList from '../../views/newssandbox/audit-manage/AuditList'
import NewList from '../../views/newssandbox/publish-manage/Newslist'
import LeaveList from '../../views/newssandbox/publish-manage/Leavelist'
import Sunset from '../../views/newssandbox/publish-manage/NewStatelist'
import NewsPreview from '../../views/newssandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/newssandbox/news-manage/NewsUpdate'
import Record from '../../views/newssandbox/work-manage/Record'
import Leave from '../../views/newssandbox/work-manage/Leave'
import {Spin } from 'antd'
import axios from "axios";
import {connect} from 'react-redux'

// 创建本地路由映射表
const LocalRouterMap = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/preview/:id": NewsPreview,
    "/news-manage/update/:id": NewsUpdate,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": NewList,
    "/publish-manage/published": LeaveList,
    "/publish-manage/sunset": Sunset,
    '/work-manage/record': Record,
    '/work-manage/leave': Leave
}

function NewsRouter(props) {

    const [BackRouteList, setBackRouteList] = useState([])//后端返回的route列表
    useEffect(() => {
        Promise.all([
            axios.get("/rights/list"),
            axios.get("/children"),
        ]).then(res => {
            // console.log(res)
            setBackRouteList([...res[0].data, ...res[1].data])
        })
    }, [])

    const { roleId: { rights } } = JSON.parse(localStorage.getItem("token"))

    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }

    const checkUserPermission = (item) => {
        // 当前登录用户权限列表是否包含
        return rights.includes(item.key)
    }

    return (
        <Spin size="large" spinning={props.isLoading}>
            <Switch>
                {
                    BackRouteList.map(item => {
                        <Route path={item.key} key={item.key} 
                            component={LocalRouterMap[item.key]}/>
                        if (checkRoute(item) && checkUserPermission(item)) {
                            return <Route path={item.key} key={item.key} 
                            component={LocalRouterMap[item.key]} exact />
                        }
                        return null
                    }
                    )
                }

                <Redirect from="/" to="/home" exact />
                {
                    BackRouteList.length > 0 && <Route path="*" 
                    component={Nopermission} />
                }
            </Switch>
        </Spin>
    )
}

const mapStateToProps = ({LoadingReducer:{isLoading}})=>({
    isLoading
})

export default connect(mapStateToProps)(NewsRouter)