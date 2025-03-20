import React from 'react';
import { Style } from 'react-imvc/component';
import { Layout } from 'antd';
import Menu from './componments/Menu/index';
import RegisterInfo from './componments/RegisterInfo/index';
import { useModelState } from 'react-imvc/hook';

const { Header, Sider, Content } = Layout;

export default function () {
  const state = useModelState();
  const { tap } = state.urlParams;

  return (
    <>
      <Style name="admin" />
      <Layout className="admin-layout">
        <Header className="admin-header">
          <Menu />
        </Header>
        <Layout className="admin-main">
          <Content className="admin-content">
            {tap == undefined && <RegisterInfo />}
            {tap === 'register_info' && <RegisterInfo />}
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
