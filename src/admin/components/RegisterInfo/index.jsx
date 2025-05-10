import React, { useState } from 'react';
import { useCtrl, useModelActions, useModelState } from 'react-imvc/hook';
import { Table, Image, Button, Space, message, Input, Modal, Descriptions } from 'antd';
import VehicleStatusTag from '../TagComponents/VehicleStatusTag';
import formatUnix from '../../../share/formatUnix';

export default function () {
  const ctrl = useCtrl();
  const state = useModelState();
  const actions = useModelActions();
  const [opinion, setOpinion] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});

  const handleApprove = async id => {
    const res = await ctrl.approveRegister(id, opinion);
    if (res.isOk) {
      message.success(res.message);
      const updatedRegisterInfo = state.registerInfo.map(item =>
        item.id === id ? { ...item, vehicle_status: 2, remark: opinion } : item
      );
      actions.UPDATE_REGISTERINFO(updatedRegisterInfo);
      setIsModalVisible(false);
      setSelectedRecord({});
    } else {
      message.warning(res.message);
    }
  };

  const handleReject = async id => {
    const res = await ctrl.rejectRegister(id, opinion);
    if (res.isOk) {
      message.success(res.message);
      const updatedRegisterInfo = state.registerInfo.map(item =>
        item.id === id ? { ...item, vehicle_status: 5, remark: opinion } : item
      );
      actions.UPDATE_REGISTERINFO(updatedRegisterInfo);
      setIsModalVisible(false);
      setSelectedRecord({});
    } else {
      message.warning(res.message);
    }
  };

  const columns = [
    {
      title: '学号',
      dataIndex: 'stu_number',
      key: 'stu_number',
      width: 50,
    },
    {
      title: '车牌号',
      dataIndex: 'license_number',
      key: 'license_number',
      width: 100,
    },
    {
      title: '车辆类型',
      dataIndex: 'vehicle_type',
      key: 'vehicle_type',
      render: type => (type === 1 ? '电动车' : '摩托车'),
      width: 60,
    },
    {
      title: '登记日期',
      dataIndex: 'filing_date',
      key: 'filing_date',
      render: date => formatUnix(date),
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'vehicle_status',
      key: 'vehicle_status',
      render: status => <VehicleStatusTag status={status} />,
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <>
          <Space direction="vertical">
            {record.vehicle_status === 1 && (
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  setIsModalVisible(true);
                  setSelectedRecord(record);
                }}
              >
                审批
              </Button>
            )}
            {record.vehicle_status !== 1 && (
              <Button
                size="small"
                color="magenta"
                variant="solid"
                onClick={() => {
                  setIsModalVisible(true);
                  setSelectedRecord(record);
                }}
              >
                详情
              </Button>
            )}
          </Space>
        </>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
      <Table
        columns={columns}
        dataSource={state.registerInfo}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ scrollToFirstRowOnChange: true, y: 550, x: true }}
        bordered
        size="small"
        style={{ width: 1400 }}
      />
      <Modal
        title="车辆登记信息详情"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={1300}
      >
        <Descriptions bordered column={3}>
          <Descriptions.Item label="学号" span={1}>
            {selectedRecord.stu_number}
          </Descriptions.Item>

          <Descriptions.Item label="车辆类型" span={1}>
            {selectedRecord.vehicle_type}
          </Descriptions.Item>
          <Descriptions.Item label="车牌号" span={1}>
            {selectedRecord.license_number}
          </Descriptions.Item>
          <Descriptions.Item label="登记提交时间" span={1}>
            {formatUnix(selectedRecord.filing_date)}
          </Descriptions.Item>
          <Descriptions.Item label="状态" span={2}>
            <VehicleStatusTag status={selectedRecord.vehicle_status} />
          </Descriptions.Item>
          <Descriptions.Item label="车牌号照片" span={1}>
            <Image src={selectedRecord.license_img} style={{ marginRight: 10 }} width={100} />
          </Descriptions.Item>
          <Descriptions.Item label="车辆外观照片" span={1}>
            <Image src={selectedRecord.vehicle_img} style={{ marginRight: 10 }} width={100} />
          </Descriptions.Item>
          <Descriptions.Item label="学生证照片" span={1}>
            <Image src={selectedRecord.stu_card_img} style={{ marginRight: 10 }} width={100} />
          </Descriptions.Item>
          {selectedRecord.remark !== '' && (
            <Descriptions.Item label="备注" span={3}>
              {selectedRecord.remark}
            </Descriptions.Item>
          )}
        </Descriptions>
        {selectedRecord.vehicle_status === 1 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>车辆登记审批</label>
              <Input.TextArea
                value={opinion}
                onChange={e => setOpinion(e.target.value)}
                placeholder="请输入审批意见"
                autoSize={{ minRows: 3, maxRows: 6 }}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Space size="middle">
                <Button color="cyan" variant="solid" onClick={() => handleApprove(selectedRecord.id)}>
                  审批通过
                </Button>
                <Button type="primary" danger onClick={() => handleReject(selectedRecord.id)}>
                  申批拒绝
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
