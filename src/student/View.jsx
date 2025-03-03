import React from 'react';
import { Layout } from 'antd';
const { Header, Sider, Content } = Layout;
import Menu from './componments/Menu/index';
import VehicleList from './componments/VehicleList/index';

const layoutStyle = {
  position: 'relative',
  width: '100vw',
  height: '100vh',
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
  display: 'inline-block',
  overflowY: 'auto',
  overflowX: 'hidden',
  backgroundColor: '#fff',
  scrollbarWidth: 'none',
};

export default function () {
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
          <VehicleList />
        </Content>
      </Layout>
    </Layout>
  );
}
