import React, { useEffect, useState } from 'react';
import { useCtrl, useModelState } from 'react-imvc/hook';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';

export default function () {
  const ctrl = useCtrl();
  const state = useModelState();
  const { announcementBasicInfo } = state;

  useEffect(async () => {
    const res = await ctrl.getAnnouncementBasicInfo();
    console.log(res);
  }, []);

  const handleAdd = async () => {
    const res = await ctrl.addAnnouncementInfo();
    if (res.isOk) {
      window.open(`/announcement/editor?id=${res.data.id}`);
    }
  };

  const handleDelete = id => {};

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 500,
    },
    {
      title: ' 状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 300,
      render: (_, record) => (
        <Space>
          <Button size="small" type="primary" onClick={() => window.open(`/announcement/editor?id=${record.id}`)}>
            编辑
          </Button>
          <Button size="small" type="primary" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              window.open(`/announcement/exhibition?announcementId=${record.id}`, '_blank');
            }}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20, width: 'auto' }}>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 20 }}>
        新增通知
      </Button>
      <Table columns={columns} dataSource={announcementBasicInfo} rowKey="id" bordered pagination={{ pageSize: 5 }} />
    </div>
  );
}
