import React, { useEffect } from 'react';
import { Style } from 'react-imvc/component';
import { useCtrl, useModelState } from 'react-imvc/hook';
import { Table, Button, Tag, Space, message } from 'antd';
import formatUnix from '../../../share/formatUnix';

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
      title: '状态',
      key: 'status',
      width: 260,
      align: 'center',
      render: (_, record) => {
        if (record.status === 1) {
          return (
            <Tag color="warning" bordered={false}>
              未发布
            </Tag>
          );
        } else if (record.status === 2) {
          return (
            <Space size={0}>
              <Tag color="success" bordered={false}>
                已发布
              </Tag>
              <Tag color="processing" bordered={false}>
                {formatUnix(record.publish_time)}
              </Tag>
            </Space>
          );
        }
      },
    },
    {
      title: '最后更新时间',
      key: 'updated_at',
      width: 170,
      render: (_, record) => {
        return (
          <Tag color="cyan" bordered={false}>
            {formatUnix(record.updated_at)}
          </Tag>
        );
      },
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
          {record.status === 1 && (
            <Button
              size="small"
              color="green"
              variant="solid"
              onClick={async () => {
                const res = await ctrl.publishAnnouncement(record.id);
                if (res.isOk) {
                  message.success(res.message);
                } else {
                  message.warning(res.message);
                }
                ctrl.getAnnouncementBasicInfo();
              }}
            >
              发布
            </Button>
          )}
          {record.status === 2 && (
            <Button
              size="small"
              color="gold"
              variant="solid"
              onClick={async () => {
                const res = await ctrl.unpublishAnnouncement(record.id);
                if (res.isOk) {
                  message.success(res.message);
                } else {
                  message.warning(res.message);
                }
                ctrl.getAnnouncementBasicInfo();
              }}
            >
              撤销
            </Button>
          )}
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
    <>
      <Style name="announcement" />
      <div className="announcement-container">
        <Space>
          <Button type="primary" onClick={handleAdd}>
            新增通知
          </Button>
          <Button
            onClick={async () => {
              await ctrl.getAnnouncementBasicInfo();
              message.success('更新成功');
            }}
          >
            刷新
          </Button>
        </Space>
        <Table
          columns={columns}
          dataSource={announcementBasicInfo}
          rowKey="id"
          bordered
          pagination={{ pageSize: 20 }}
          scroll={{ scrollToFirstRowOnChange: true, y: 500, x: true }}
        />
      </div>
    </>
  );
}
