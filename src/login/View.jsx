import React from 'react';
import { Style } from 'react-imvc/component';
import { useCtrl } from 'react-imvc/hook';
import sleep from '../share/sleep';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = () => {
  const ctrl = useCtrl();
  // 表单提交处理函数
  const onFinish = async values => {
    console.log('Received values of form: ', values);
    // 模拟登录逻辑
    if (values.username === 'zhanghaoran' && values.password === 'abcd1234!@#$') {
      const res = await ctrl.fetch('/login', { method: 'POST', body: JSON.stringify(values) });
      console.log(res);
      message.success('登录成功！');
      await sleep(1000);
      ctrl.redirect('/student/home');
    } else {
      message.error('用户名或密码错误！');
    }
  };

  return (
    <div>
      <Style name="login" />
      <div className="login-container">
        <div className="login-form">
          <h1 className="login-title">登录</h1>
          <Form name="login_form" onFinish={onFinish}>
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名！' }]}>
              <Input prefix={<UserOutlined />} Outlined placeholder="用户名" size="large" />
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
