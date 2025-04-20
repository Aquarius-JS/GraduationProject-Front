import React from 'react';
import { Style } from 'react-imvc/component';
import { useModelState } from 'react-imvc/hook';
import { Layout } from 'antd';
import Menu from './components/Menu/index';
import RegisterInfo from './components/RegisterInfo/index';
import Announcement from './components/Announcement';
import ViolationInfo from './components/ViolationInfo';
import UnregisteredVehicleInfo from './components/UnregisteredVehicleInfo';

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
            {tap === 'announcement' && <Announcement />}
            {tap === 'violation_info' && <ViolationInfo />}
            {tap === 'unregistered-reporting' && <UnregisteredVehicleInfo />}
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
