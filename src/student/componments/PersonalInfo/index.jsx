import React, { useState } from 'react';
import { Style } from 'react-imvc/component';
import { useCtrl, useModelActions, useModelState } from 'react-imvc/hook';
import { Card, Descriptions, Upload, Button, message, Modal, Form, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function () {
  const ctrl = useCtrl();
  const state = useModelState();
  const actions = useModelActions();
  const { userInfo } = state;
  const [hover, setHover] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const defaultImg = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

  const customRequest = async options => {
    const { file, action: url } = options;
    if (file.type.indexOf('image') === -1) {
      message.warning('请选择图片');
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', url, true);
    xhr.onload = () => {
      const result = JSON.parse(xhr.responseText);
      actions.UPDATE_USERINFO({ ...userInfo, user_img: result.resUrl });
      message.success('上传成功');
    };
    xhr.upload.onprogress = e => {};
    xhr.send(file);
  };

  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue(userInfo);
  };
  const handleOk = () => {
    form.validateFields().then(async values => {
      const res = await ctrl.updateStuInfo(values);
      if (res.isOk) {
        actions.UPDATE_USERINFO({ ...userInfo, ...values });
        setIsModalVisible(false);
        message.success('信息更新成功');
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showPasswordModal = () => {
    setIsPasswordModalVisible(true);
  };

  const handlePasswordOk = () => {
    passwordForm.validateFields().then(values => {
      // 处理密码更新逻辑
      console.log(values);
      setIsPasswordModalVisible(false);
      message.success('密码更新成功');
    });
  };

  const handlePasswordCancel = () => {
    setIsPasswordModalVisible(false);
  };

  return (
    <>
      <Style name="personalInfo" />
      <Card
        title="个人信息"
        className="personal-info-card"
        extra={
          <>
            <Button onClick={showModal}>编辑信息</Button>
            <Button onClick={showPasswordModal} style={{ marginLeft: 10 }}>
              修改密码
            </Button>
          </>
        }
      >
        <div className="avatar-box" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <div className="avatar-img-box">
            <img src={userInfo?.user_img || defaultImg} alt="头像" />
            {hover && (
              <div className="avatar-upload-box">
                <Upload
                  name="avatar"
                  showUploadList={false}
                  action="http://localhost:3000/uploadStuAvatar"
                  customRequest={customRequest}
                >
                  <Button icon={<UploadOutlined />} type="link" className="avatar-upload-btn">
                    更换头像
                  </Button>
                </Upload>
              </div>
            )}
          </div>
        </div>
        <Descriptions column={1}>
          <Descriptions.Item label={<span>学号</span>}>{userInfo?.stu_number}</Descriptions.Item>
          <Descriptions.Item label={<span>用户名</span>}>{userInfo?.user_name}</Descriptions.Item>
          <Descriptions.Item label={<span>手机号</span>}>{userInfo?.phone_number}</Descriptions.Item>
          <Descriptions.Item label={<span>邮箱</span>}>{userInfo?.email}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Modal title="编辑个人信息" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="stu_number" label="学号">
            <Input disabled />
          </Form.Item>
          <Form.Item name="user_name" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone_number" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="修改密码" visible={isPasswordModalVisible} onOk={handlePasswordOk} onCancel={handlePasswordCancel}>
        <Form form={passwordForm} layout="vertical">
          <Form.Item name="old_password" label="旧密码" rules={[{ required: true, message: '请输入旧密码' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="new_password" label="新密码" rules={[{ required: true, message: '请输入新密码' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label="确认新密码"
            dependencies={['new_password']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
