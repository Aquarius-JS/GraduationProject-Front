import React from 'react';
import { useModelState } from 'react-imvc/hook';
import { Style } from 'react-imvc/component';
import { Layout } from 'antd';
import HeadRegion from './components/HeadRegion';
import Menu from './components/Menu/index';
import VehicleList from './components/VehicleList/index';
import VehicleRegistration from './components/VehicleRegistration';
import PersonalInfo from './components/PersonalInfo/index';
import ViolationInfoModal from './components/ViolationInfoModal';
const { Header, Sider, Content } = Layout;

export default function () {
  const state = useModelState();
  const { tap } = state.urlParams;

  return (
    <>
      <Style name="home" />
      <Layout className="stu-layout">
        <Header className="stu-header">
          <HeadRegion />
        </Header>
        <Layout className="stu-main">
          <Sider className="stu-sider" width={150}>
            <Menu />
          </Sider>
          <Content className="stu-content">
            {tap == undefined && <VehicleList />}
            {tap === 'mycar' && <VehicleList />}
            {tap === 'carregister' && <VehicleRegistration />}
            {tap === 'illegalinfo' && <div>违规信息</div>}
            {tap === 'personalinfo' && <PersonalInfo />}
          </Content>
        </Layout>
      </Layout>
      <ViolationInfoModal />
    </>
  );
}
