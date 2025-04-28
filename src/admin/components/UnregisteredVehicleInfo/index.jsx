import React, { useState, useEffect } from 'react';
import { Style } from 'react-imvc/component';
import { useCtrl, useModelState } from 'react-imvc/hook';
import { Input, Table, Button, Tag, Space, Modal, Descriptions, Image, message } from 'antd';
import ReportingSourceTag from '../TagComponents/ReportingSourceTag';
import StatusTag from '../TagComponents/StatusTag';
import formatUnix from '../../../share/formatUnix';

export default function () {
  const ctrl = useCtrl();
  const state = useModelState();
  const [unregisteredVehicleInfo, setUnregisteredVehicleInfo] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null); // 当前选中的记录
  const [isModalVisible, setIsModalVisible] = useState(false); // 控制 Modal 显示
  const [approvalComment, setApprovalComment] = useState(''); // 审批意见

  useEffect(async () => {
    const res = await ctrl.getAllUnregisteredVehicleInfo();
    if (res.isOk) {
      setUnregisteredVehicleInfo(res.data);
    }
  }, []);

  const handleShowDetails = record => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleApprove = async (id, status, remark) => {
    const res = await ctrl.approveUnregisteredVehicleInfo({ id, status, remark });
    if (res.isOk) {
      message.success(res.message);
      const updatedInfo = unregisteredVehicleInfo.map(item => (item.id === id ? { ...item, status, remark } : item));
      setUnregisteredVehicleInfo(updatedInfo);
      setSelectedRecord({ ...selectedRecord, status, remark });
    } else {
      message.warning(res.message);
    }
  };

  const columns = [
    {
      title: '车牌号',
      dataIndex: 'license_number',
      key: 'license_number',
      width: 200,
      align: 'center',
    },
    {
      title: '违规地点',
      key: 'detection_location',
      dataIndex: 'detection_location',
      width: 300,
    },
    {
      title: '违规时间',
      key: 'reporting_time',
      width: 300,
      render: (_, record) => {
        return formatUnix(record.reporting_time);
      },
    },
    {
      title: '信息来源',
      key: 'reporting_source',
      width: 130,
      align: 'center',
      filters: [
        {
          text: '机器',
          value: 0,
        },
        {
          text: '人工',
          value: 1,
        },
      ],
      filtered: true,
      defaultFilteredValue: ['0', '1'],
      onFilter: (value, record) => record.reporting_source === value,
      render: (_, record) => <ReportingSourceTag reportingSource={record.reporting_source} />,
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      align: 'center',
      filtered: true,
      filters: [
        {
          text: '待审核',
          value: 0,
        },
        {
          text: '正常',
          value: 1,
        },
        {
          text: '作废',
          value: 2,
        },
      ],
      defaultFilteredValue: ['0', '1'],
      onFilter: (value, record) => record.status === value,
      render: (_, record) => <StatusTag status={record.status} />,
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      align: 'center',
      render: (_, record) => {
        return (
          <Space>
            {record.status === 0 ? (
              <Button size="small" type="primary" onClick={() => handleShowDetails(record)}>
                审批
              </Button>
            ) : (
              <Button size="small" color="magenta" variant="solid" onClick={() => handleShowDetails(record)}>
                详情
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Style name="announcement" />
      <div className="announcement-container">
        <Table
          columns={columns}
          dataSource={unregisteredVehicleInfo}
          rowKey="id"
          bordered
          pagination={{ pageSize: 20 }}
          scroll={{ scrollToFirstRowOnChange: true, y: 500, x: true }}
        />
      </div>
      {selectedRecord && (
        <Modal
          title="详情"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              关闭
            </Button>,
          ]}
          width={1300}
        >
          <Descriptions bordered column={3}>
            <Descriptions.Item label="车牌号" span={1}>
              {selectedRecord.license_number}
            </Descriptions.Item>
            <Descriptions.Item label="违规时间" span={2}>
              {formatUnix(selectedRecord.reporting_time)}
            </Descriptions.Item>
            <Descriptions.Item label="信息来源" span={1}>
              <ReportingSourceTag reportingSource={selectedRecord.reporting_source} />
            </Descriptions.Item>
            <Descriptions.Item label="违规地点" span={1}>
              {selectedRecord.detection_location}
            </Descriptions.Item>
            <Descriptions.Item label="状态" span={1}>
              <StatusTag status={selectedRecord.status} />
            </Descriptions.Item>
            <Descriptions.Item label="图片列表" span={3}>
              {selectedRecord.img_list.map((img, index) => (
                <Image key={index} src={img.url} alt={`违规图片${index + 1}`} style={{ marginRight: 10 }} width={100} />
              ))}
            </Descriptions.Item>
            {selectedRecord.remark && (
              <Descriptions.Item label="备注" span={3}>
                {selectedRecord.remark}
              </Descriptions.Item>
            )}
          </Descriptions>
          {selectedRecord && selectedRecord.status === 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>审批意见</label>
                <Input.TextArea
                  value={approvalComment}
                  onChange={e => setApprovalComment(e.target.value)}
                  placeholder="请输入审批意见"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Space size="middle">
                  <Button
                    color="cyan"
                    variant="solid"
                    onClick={() => handleApprove(selectedRecord.id, 1, approvalComment)}
                  >
                    确认信息
                  </Button>
                  <Button type="primary" danger onClick={() => handleApprove(selectedRecord.id, 2, approvalComment)}>
                    取消登记
                  </Button>
                </Space>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
