import React from 'react';
import { Style } from 'react-imvc/component';
import { useCtrl } from 'react-imvc/hook';
import sleep from '../share/sleep';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import uniEncrypt from '../share/uniEncrypt';

const Login = () => {
  const ctrl = useCtrl();
  const onFinish = async values => {
    values.password = uniEncrypt(values.password);
    const res = await ctrl.fetch('/login', { method: 'POST', body: JSON.stringify(values) });
    if (res.isOk) {
      message.success('登录成功！');
      await sleep(1000);
      ctrl.redirect('/student/home');
    } else {
      message.error('账号或密码错误！');
    }
  };

  return (
    <div>
      <Style name="login" />
      <div className="login-container">
        <div className="login-form">
          <h1 className="login-title">登录</h1>
          <Form name="login_form" onFinish={onFinish}>
            <Form.Item name="stuNumber" rules={[{ required: true, message: '请输入账号！' }]}>
              <Input prefix={<UserOutlined />} Outlined placeholder="账号" size="large" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
              <Input prefix={<LockOutlined />} type="password" placeholder="密码" size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
