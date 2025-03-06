import React, { useState } from 'react';
import { Style } from 'react-imvc/component';
import { useModelState } from 'react-imvc/hook';
import { Card, Descriptions, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function () {
  const state = useModelState();
  const { userInfo } = state;
  const [hover, setHover] = useState(false);

  const defaultImg = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

  const handleChange = info => {
    // TODO: 上传头像接口
    if (info.file.status === 'done') {
      setAvatar(info.file.response.url);
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
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
                  action="/upload" // TODO:替换为实际的上传接口
                  onChange={handleChange}
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
