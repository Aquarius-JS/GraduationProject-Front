import React, { useState } from 'react';
import { Style } from 'react-imvc/component';
import { useModelActions, useModelState } from 'react-imvc/hook';
import { Card, Descriptions, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function () {
  const state = useModelState();
  const actions = useModelActions();
  const { userInfo } = state;
  const [hover, setHover] = useState(false);

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

  return (
    <>
      <Style name="personalInfo" />
      <Card title="个人信息" className="personal-info-card">
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
    </>
  );
}
