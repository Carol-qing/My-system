import React from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  // UserOutlined
} from '@ant-design/icons';
import { Layout, theme, Dropdown} from 'antd';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import Item from 'antd/es/list/Item';
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
  // const menu = (
  //   <Menu>
  //     <Menu.Item key='admin'>
  //       {roleName}
  //     </Menu.Item>
  //     <Menu.Item danger key='tuichu' onClick={() => {
  //         localStorage.removeItem("token")
  //         props.history.replace("/login")
  //       }}>
  //       退出
  //     </Menu.Item>
  //   </Menu>
  // )

  const items = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.baidu.com">
          {roleName}
        </a>
      ),
      disabled: true,
    },
    {
      key: '4',
      danger: true,
      label: (
        <a onClick={() => {
          localStorage.removeItem("token")
          props.history.replace("/login")
        }}>{'退出'}</a>
      ),
    },
  ];

  return (
    <Header style={{ padding: '0 16px', background: colorBgContainer }}>
      {
        props.isCollapsed ? 
        <MenuUnfoldOutlined onClick={changeCollapsed}/> : 
        <MenuFoldOutlined onClick={changeCollapsed}/>
      }

      <div style={{float: 'right'}}>
        {/* <span>欢迎<span style={{color:"#1890ff"}}>{username}</span>回来</span> */}
        <Dropdown menu={{items}}>
          {/* <Avatar size="large" icon={<UserOutlined />} /> */}
          <span>欢迎<span style={{color:"#1890ff"}}>{username}</span>回来</span>
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