import React from 'react';
import { useModelState } from 'react-imvc/hook';
import { Style } from 'react-imvc/component';
import { Layout } from 'antd';
import Menu from './componments/Menu/index';
const { Header, Sider, Content } = Layout;

export default function () {
  const state = useModelState();
//   const { tap } = state.urlParams;

  return (
    <>
      <Layout className="stu-layout">
        <Header className="stu-header">Header</Header>
        <Layout className="stu-main">
          <Sider className="stu-sider">
            {/* <Menu></Menu> */}
          </Sider>
          <Content className="stu-content">
            {/* {tap == undefined && <VehicleList />}
            {tap === 'mycar' && <VehicleList />}
            {tap === 'carregister' && <VehicleRegistration />}
            {tap === 'illegalinfo' && <div>违规信息</div>}
            {tap === 'personalinfo' && <PersonalInfo />} */}
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
