import React from 'react';
import { useModelState } from 'react-imvc/hook';
import { Card, Descriptions } from 'antd';

export default function () {
  const state = useModelState();
  const { userInfo } = state;
  return (
    <Card title="个人信息" style={{ width: 600, margin: '50px auto' }}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="头像" labelStyle={{ textAlign: 'right' }} contentStyle={{ textAlign: 'left' }}>
          {userInfo?.user_img ? <img src={userInfo?.user_img} alt="头像" style={{ width: 100, height: 100 }} /> : '无'}
        </Descriptions.Item>
        <Descriptions.Item label="学号" labelStyle={{ textAlign: 'right' }} contentStyle={{ textAlign: 'left' }}>
          {userInfo?.stu_number}
        </Descriptions.Item>
        <Descriptions.Item label="用户名" labelStyle={{ textAlign: 'right' }} contentStyle={{ textAlign: 'left' }}>
          {userInfo?.user_name}
        </Descriptions.Item>
        <Descriptions.Item label="手机号" labelStyle={{ textAlign: 'right' }} contentStyle={{ textAlign: 'left' }}>
          {userInfo?.phone_number}
        </Descriptions.Item>
        <Descriptions.Item label="邮箱" labelStyle={{ textAlign: 'right' }} contentStyle={{ textAlign: 'left' }}>
          {userInfo?.email}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
