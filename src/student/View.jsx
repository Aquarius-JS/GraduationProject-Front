import React from 'react';
import { useModelState } from 'react-imvc/hook';
import { Layout } from 'antd';
import Menu from './componments/Menu/index';
import VehicleList from './componments/VehicleList/index';
import PersonalInfo from './componments/PersonalInfo/index';
const { Header, Sider, Content } = Layout;

const layoutStyle = {
  width: '100vw',
  height: '100vh',
  position: 'relative',
};
const headerStyle = {
  height: 64,
  width: '100%',
  backgroundColor: '#4096ff',
  position: 'fixed',
  zIndex: 999,
  top: 0,
  left: 0,
};
const contentStyle = {
  width: 'calc(100vw - 200px)',
  backgroundColor: '#fff',
};
const siderStyle = {
  height: 'calc(100vh - 64px)',
  overflowY: 'auto',
  overflowX: 'hidden',
  backgroundColor: '#fff',
  scrollbarWidth: 'none',
};

export default function () {
  const state = useModelState();
  const { tap } = state.urlParams;

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>Header</Header>
      <Layout
        style={{
          position: 'fixed',
          top: 64,
        }}
      >
        <Sider style={siderStyle}>
          <Menu></Menu>
        </Sider>
        <Content style={contentStyle}>
          {tap === 'mycar' && <VehicleList />}
          {tap === 'carregister' && <div>车辆注册</div>}
          {tap === 'illegalinfo' && <div>违规信息</div>}
          {tap === 'personalinfo' && <PersonalInfo />}
        </Content>
      </Layout>
    </Layout>
  );
}
