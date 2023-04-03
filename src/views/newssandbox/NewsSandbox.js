import React, { useEffect } from 'react'
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
import NProgress from 'nprogress'
// import { Switch, Route, Redirect } from "react-router-dom";
// import Home from "./home/Home";
// import UserList from "./user-manage/UserList";
// import RightList from "./right-manage/RightList";
// import RoleList from "./right-manage/RoleList";
// import NoPermission from "./nopermission";
import './NewsSandBox.css'
import 'nprogress/nprogress.css'
import NewsRouter from '../../components/sandbox/NewsRouter';


import { Layout, theme } from 'antd';
const {  Content } = Layout;

export default function NewsSandbox() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  
  // 进度条处理
  NProgress.start()
  useEffect(() => {
    NProgress.done()
  })
  return (
    <Layout>
      <SideMenu/>
      <Layout className="site-layout">
        <TopHeader/>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <NewsRouter></NewsRouter>
          {/* <Switch>
              <Route path="/home" component={Home}/>
              <Route path="/user-manage/list" component={UserList}/>
              <Route path="/right-manage/role/list" component={RoleList}/>
              <Route path="/right-manage/right/list" component={RightList}/>

              <Redirect from='/' to='/home' exact/>
              <Route path="*" component={NoPermission} />
          </Switch> */}
        </Content>
      </Layout>
      
    </Layout>
  )
}
