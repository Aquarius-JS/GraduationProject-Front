import React, { useState, useEffect } from 'react';
import { Style } from 'react-imvc/component';
import { useCtrl, useModelState } from 'react-imvc/hook';
import { Input, Table, Button, Popconfirm, Space, Modal, Descriptions, Image, message } from 'antd';
import StatusTag from '../TagComponents/StatusTag';
import ReportingSourceTag from '../TagComponents/ReportingSourceTag';
import ViolationTagList from '../TagComponents/ViolationTagList';
import formatUnix from '../../../share/formatUnix';

export default function () {
  const ctrl = useCtrl();
  const state = useModelState();
  const [violationInfo, setViolationInfo] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null); // 当前选中的记录
  const [isModalVisible, setIsModalVisible] = useState(false); // 控制 Modal 显示
  const [approvalComment, setApprovalComment] = useState(''); // 审批意见
  const [appealResponse, setAppealResponse] = useState(''); //申诉处理意见

  useEffect(async () => {
    const res = await ctrl.getAllViolationInfo();
    if (res.isOk) {
      setViolationInfo(res.data);
    }
  }, []);

  const handleShowDetails = record => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleApprove = async (id, status, remark) => {
    const res = await ctrl.approveViolationInfo({ id, status, remark });
    if (res.isOk) {
      message.success(res.message);
      const updatedViolationInfo = violationInfo.map(item => (item.id === id ? { ...item, status, remark } : item));
      setViolationInfo(updatedViolationInfo);
      setSelectedRecord({ ...selectedRecord, status, remark });
    } else {
      message.warning(res.message);
    }
    setApprovalComment('');
  };

  const appealHandle = async (id, status, appealResponse) => {
    const res = await ctrl.violationInfoAppealHandle({ id, status, appealResponse });
    if (res.isOk) {
      message.success(res.message);
      const updatedViolationInfo = violationInfo.map(item =>
        item.id === id ? { ...item, status, appeal_response: appealResponse } : item
      );
      setViolationInfo(updatedViolationInfo);
      setSelectedRecord({ ...selectedRecord, status, appeal_response: appealResponse });
      setAppealResponse('');
    } else {
      message.warning(res.message);
    }
    setAppealResponse('');
  };

  const dealtHandle = async id => {
    const res = await ctrl.violationInfoDealtById({ id });
    if (res.isOk) {
      message.success(res.message);
      const updatedViolationInfo = violationInfo.map(item => (item.id === id ? { ...item, status: 6 } : item));
      setViolationInfo(updatedViolationInfo);
      setSelectedRecord({ ...selectedRecord, status: 6 });
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
      title: '违规类型',
      key: 'violation_title',
      width: 260,
      align: 'center',
      render: (_, record) => <ViolationTagList violationTitle={record.violation_title} />,
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
          dataSource={violationInfo}
          rowKey="id"
          bordered
          pagination={{ pageSize: 20 }}
          scroll={{ scrollToFirstRowOnChange: true, y: 500, x: true }}
        />
      </div>
      {selectedRecord && (
        <Modal
          title="违规详情"
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
            <Descriptions.Item label="违规类型" span={1}>
              <ViolationTagList violationTitle={selectedRecord.violation_title ?? []} />
            </Descriptions.Item>
            <Descriptions.Item label="违规时间" span={1}>
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
            <Descriptions.Item label="违规说明" span={3}>
              {selectedRecord.violation_content}
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
                    确认违规
                  </Button>
                  <Button type="primary" danger onClick={() => handleApprove(selectedRecord.id, 2, approvalComment)}>
                    取消违规
                  </Button>
                </Space>
              </div>
            </div>
          )}
          {selectedRecord && selectedRecord.status === 3 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>申诉结果</label>
                <Input.TextArea
                  value={appealResponse}
                  onChange={e => setAppealResponse(e.target.value)}
                  placeholder="请输入申诉审核结果"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Space size="middle">
                  <Button
                    color="cyan"
                    variant="solid"
                    onClick={() => appealHandle(selectedRecord.id, 4, appealResponse)}
                  >
                    申诉通过
                  </Button>
                  <Button type="primary" danger onClick={() => appealHandle(selectedRecord.id, 5, appealResponse)}>
                    申诉拒绝
                  </Button>
                </Space>
              </div>
            </div>
          )}
          {selectedRecord && (selectedRecord.status === 1 || selectedRecord.status === 5) && (
            <div style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>核销</label>
                <Popconfirm
                  title="确认核销"
                  description="请确认信息是否有误"
                  okText="确认"
                  cancelText="取消"
                  onConfirm={() => {
                    return dealtHandle(selectedRecord.id);
                  }}
                >
                  <Button type="primary">核销</Button>
                </Popconfirm>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
