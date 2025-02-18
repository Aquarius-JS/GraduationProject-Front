import React from 'react';
import { Layout } from 'antd';
import Menu from './componments/Menu/index';
const { Header, Sider, Content } = Layout;

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
  backgroundColor: '#fff',
  display: 'inline-block',
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
        <Content style={contentStyle}>Content</Content>
      </Layout>
    </Layout>
  );
}
