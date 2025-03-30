import React, { useEffect, useState } from 'react';
import { useCtrl, useModelState } from 'react-imvc/hook';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';

export default function () {
  const ctrl = useCtrl();
  const state = useModelState();
  const { announcementBasicInfo } = state;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [form] = Form.useForm();

  useEffect(async () => {
    const res = await ctrl.getAnnouncementBasicInfo();
    console.log(res);
  }, []);

  const handleAdd = () => {
    window.open('/announcement/editor?id=');
  };

  const handleEdit = record => {
    setIsEditing(true);
    setCurrentAnnouncement(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = id => {
    setAnnouncements(prev => prev.filter(item => item.id !== id));
    message.success('通知已删除');
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (isEditing) {
        // 编辑模式
        setAnnouncements(prev =>
          prev.map(item => (item.id === currentAnnouncement.id ? { ...item, ...values } : item))
        );
        message.success('通知已更新');
      } else {
        // 新增模式
        const newAnnouncement = {
          id: Date.now(),
          ...values,
        };
        setAnnouncements(prev => [...prev, newAnnouncement]);
        message.success('通知已添加');
      }
      setIsModalVisible(false);
    });
  };

  const columns = [
    // {
    //   title: 'id',
    //   dataIndex: 'id',
    //   key: 'id',
    //   width: 100,
    // },
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
          <Button size="small" type="primary" onClick={() => handleEdit(record)}>
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
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 20 }} size="middle">
        新增通知
      </Button>
      <Table columns={columns} dataSource={announcementBasicInfo} rowKey="id" bordered pagination={{ pageSize: 5 }} />
      <Modal
        title={isEditing ? '编辑通知' : '新增通知'}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="提交"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入通知标题' }]}>
            <Input placeholder="请输入通知标题" />
          </Form.Item>
          <Form.Item label="内容" name="content" rules={[{ required: true, message: '请输入通知内容' }]}>
            <Input.TextArea rows={4} placeholder="请输入通知内容" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
