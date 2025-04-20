import React, { useState, useEffect } from 'react';
import { Style } from 'react-imvc/component';
import { useCtrl, useModelState } from 'react-imvc/hook';
import { Input, Table, Button, Tag, Space, Modal, Descriptions, Image, message } from 'antd';
import formatUnix from '../../../share/formatUnix';

export default function () {
  const ctrl = useCtrl();
  const state = useModelState();
  const [violationInfo, setViolationInfo] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null); // 当前选中的记录
  const [isModalVisible, setIsModalVisible] = useState(false); // 控制 Modal 显示
  const [approvalComment, setApprovalComment] = useState(''); // 审批意见

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
      render: (_, record) => {
        return record.violation_title.map(item => {
          return (
            <Tag
              color={item === '超载' ? 'red' : item === '超速' ? 'error' : item === '违停' ? 'volcano' : 'warning'}
              bordered={false}
              key={item}
            >
              {item}
            </Tag>
          );
        });
      },
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
      render: (_, record) => {
        const reporting_source = record.reporting_source;
        return (
          <Tag
            color={reporting_source === 0 ? 'cyan' : reporting_source === 1 ? 'blue' : 'lime'}
            bordered={false}
            key={record.id}
          >
            {reporting_source === 0 ? '机器' : reporting_source === 1 ? '人工' : '其他'}
          </Tag>
        );
      },
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
      render: (_, record) => {
        const status = record.status;
        return (
          <Tag
            color={status === 0 ? 'warning' : status === 1 ? 'green' : status === 2 ? 'gray' : 'blue'}
            bordered={false}
            key={record.id}
          >
            {status === 0 ? '待审核' : status === 1 ? '正常' : status === 2 ? '作废' : '其他'}
          </Tag>
        );
      },
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
        <Space>
          <Button
            type="primary"
            onClick={async () => {
              const res = await ctrl.addAnnouncementInfo();
              if (res.isOk) {
                window.open(`/announcement/editor?id=${res.data.id}`);
              }
            }}
          >
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
              {selectedRecord.violation_title.map(item => (
                <Tag
                  bordered={false}
                  color={item === '超载' ? 'red' : item === '超速' ? 'error' : item === '违停' ? 'volcano' : 'warning'}
                  key={item}
                >
                  {item}
                </Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="违规时间" span={1}>
              {formatUnix(selectedRecord.reporting_time)}
            </Descriptions.Item>
            <Descriptions.Item label="信息来源" span={1}>
              <Tag
                bordered={false}
                color={
                  selectedRecord.reporting_source === 0
                    ? 'cyan'
                    : selectedRecord.reporting_source === 1
                    ? 'blue'
                    : 'lime'
                }
              >
                {selectedRecord.reporting_source === 0
                  ? '机器'
                  : selectedRecord.reporting_source === 1
                  ? '人工'
                  : '其他'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="违规地点" span={1}>
              {selectedRecord.detection_location}
            </Descriptions.Item>
            <Descriptions.Item label="状态" span={1}>
              <Tag
                bordered={false}
                color={
                  selectedRecord.status === 0
                    ? 'warning'
                    : selectedRecord.status === 1
                    ? 'green'
                    : selectedRecord.status === 2
                    ? 'gray'
                    : 'blue'
                }
              >
                {selectedRecord.status === 0
                  ? '待审核'
                  : selectedRecord.status === 1
                  ? '正常'
                  : selectedRecord.status === 2
                  ? '作废'
                  : '其他'}
              </Tag>
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
        </Modal>
      )}
    </>
  );
}
