import React, { useEffect, useState } from 'react'
import { Layout, Menu} from 'antd';
import { withRouter } from "react-router-dom";
import {
  BarChartOutlined,
  UserOutlined,
  KeyOutlined,
  CopyOutlined,
  SolutionOutlined,
  DashboardOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import './index.css'
import axios from 'axios'
import { connect } from "react-redux";

const { Sider } = Layout;
const {SubMenu } = Menu
// 模拟数组结构
// const menuList = [
//   {
//     key:"/home",
//     title:"首页",
//     icon:<UserOutlined />
//   },
//   {
//     key:"/user-manage",
//     title:"用户管理",
//     icon:<UserOutlined />,
//     children:[
//       {
//         key:"/user-manage/list",
//         title:"用户列表",
//         icon:<UserOutlined />
//       }
//     ]
//   },
//   {
//     key:"/right-manage",
//     title:"权限管理",
//     icon:<VideoCameraOutlined />,
//     children:[
//       {
//         key:"/right-manage/role/list",
//         title:"角色列表",
//         icon:<VideoCameraOutlined />
//       },
//       {
//         key:"/right-manage/right/list",
//         title:"权限列表",
//         icon:<VideoCameraOutlined />
//       }
//     ]
//   },
//   {
//     key:"/news",
//     title:"文章管理",
//     icon:<UserOutlined />
//   },
//   {
//     key:"/shenhe",
//     title:"审核管理",
//     icon:<UserOutlined />
//   },
//   {
//     key:"/fabu",
//     title:"发布管理",
//     icon:<UploadOutlined />
//   },
// ]

// 模拟icon映射表
const iconList = {
  "/home":<BarChartOutlined />,
  "/user-manage":<UserOutlined/>,
  "/right-manage":<KeyOutlined />,
  "/work-manage":<DashboardOutlined />,
  "/news-manage":<CopyOutlined />,
  "/audit-manage":<SolutionOutlined />,
  "/publish-manage":<UnorderedListOutlined />,
}

function SideMenu(props) {
  const [menu, setMenu] = useState([])
  useEffect(() => {
    // axios.get("/rights?_embed=children").then(res => {
    axios.get("/rights").then(res => {
      setMenu(res.data)
    })
  },[])

  const { roleId: {rights} } = JSON.parse(localStorage.getItem("token"))
  
  // 未来通过开关配置权限
  const checkPagePermission = (item) => {
    return item.pagepermisson && rights.includes(item.key)
  }
  const renderMenu = (menuList) => {
    return menuList && menuList.map(item => {
      if(item.children?.length>0 && checkPagePermission(item)){
        return <SubMenu key={item.key} title={item.title} icon={iconList[item.key]}>
         {renderMenu(item.children)} 
        </SubMenu>
      }
      return checkPagePermission(item) && 
      <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
        props.history.push(item.key)
      }}
      >{item.title}
      </Menu.Item>
    })
  }

  // 刷新页面侧边栏高亮显示
  const selectKeys = [...props.location.pathname]
  const openKeys = ["/" + props.location.pathname.split("/")[1]]

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{display:"flex",height:"100%", "flexDirection":"column"}}>
        <div className="logo">智能人事管理系统</div>
        <div style={{flex:1,"overflow":"auto"}}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={selectKeys}
            defaultOpenKeys={openKeys}
            // items={renderMenu(menu)}
          >
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}

const mapStateToProps =({CollApsedReducer:{isCollapsed}}) =>{
  return {
    isCollapsed
  }
}

export default connect(mapStateToProps)(withRouter(SideMenu))
