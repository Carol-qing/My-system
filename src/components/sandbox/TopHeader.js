import React from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Layout, theme, Dropdown, Avatar, Menu } from 'antd';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
const { Header } = Layout;


function TopHeader(props) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const changeCollapsed = () => {
    // 改变state中的isCollapsed状态
    props.changeCollapsed()
  }
  const { roleId:{roleName},username} = JSON.parse(localStorage.getItem("token"))
  const menu = (
    <Menu>
      <Menu.Item key='admin'>
        {roleName}
      </Menu.Item>
      <Menu.Item danger key='tuichu' onClick={() => {
          localStorage.removeItem("token")
          props.history.replace("/login")
        }}>
        退出
      </Menu.Item>
    </Menu>
  )

  return (
    <Header style={{ padding: '0 16px', background: colorBgContainer }}>
      {
        props.isCollapsed ? 
        <MenuUnfoldOutlined onClick={changeCollapsed}/> : 
        <MenuFoldOutlined onClick={changeCollapsed}/>
      }

      <div style={{float: 'right'}}>
        <span>欢迎<span style={{color:"#1890ff"}}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <div>
          <Avatar size="large" icon={<UserOutlined />} />
          </div>
        </Dropdown>
      </div>
    </Header>
  )
}

/* 
  connect(
    // mapStateToProps
    // mapDispatchToProps
  )(被包装的组件)
*/

const mapStateToProps = ({CollApsedReducer:{isCollapsed}}) => {
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  // 改变state中的isCollapsed状态
  changeCollapsed(){
    return {
      type: "change_collapsed"
    }//action
  }
}

export default connect(mapStateToProps,mapDispatchToProps)
(withRouter(TopHeader))