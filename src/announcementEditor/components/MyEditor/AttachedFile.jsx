import React from 'react';
import { useCtrl, useModelActions, useModelState } from 'react-imvc/hook';
import { Button, Table, Space, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function () {
  const ctrl = useCtrl();
  const state = useModelState();
  const actions = useModelActions();
  const { announcementId, announcementInfo } = state;
  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '文件链接',
      dataIndex: 'url',
      key: 'url',
      width: 100,
      render: url => (
        <a href={url} target="_blank">
          查看文件
        </a>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            danger
            type="link"
            onClick={() => {
              const list = announcementInfo.attached_file_list_info.filter(item => item.id !== record.id);
              actions.UPDATE_ANNOUNCEMENTATTACHEDFILE(list);
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const customRequest = async options => {
    const { file, action: url } = options;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', url, true);
    xhr.onload = () => {
      const result = JSON.parse(xhr.responseText);
      const fileItem = {
        id: result.fileName,
        url: result.url,
        name: file.name,
      };
      const oldList = announcementInfo.attached_file_list_info;
      actions.UPDATE_ANNOUNCEMENTATTACHEDFILE([...oldList, fileItem]);
      message.success('上传成功');
    };
    xhr.upload.onprogress = e => {};
    xhr.send(file);
  };

  return (
    <>
      <div className="attached-file-container">
        <Space direction="vertical">
          <div>
            <span>附件管理:</span>
          </div>
          <div>
            <Upload showUploadList={false} action="http://localhost:3000/uploadFile" customRequest={customRequest}>
              <Button icon={<UploadOutlined />} type="link">
                添加附件
              </Button>
            </Upload>
            <Button
              size="small"
              type="primary"
              onClick={async () => {
                const res = await ctrl.updateAttachedFileListInfo(
                  announcementId,
                  announcementInfo.attached_file_list_info
                );
                if (res.isOk) {
                  message.success(res.message);
                }
              }}
            >
              保存
            </Button>
          </div>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={announcementInfo?.attached_file_list_info}
            showHeader={false}
            pagination={false}
            style={{ width: 500 }}
          />
        </Space>
      </div>
    </>
  );
}
