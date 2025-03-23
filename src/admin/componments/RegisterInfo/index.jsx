import React, { useState } from 'react';
import { useCtrl, useModelState } from 'react-imvc/hook';
import { Table, Image, Button, Space, message, Popover, Input } from 'antd';

export default function () {
  const ctrl = useCtrl();
  const state = useModelState();
  const [rejectReason, setRejectReason] = useState('');

  const formatDate = unixTime => {
    const date = new Date(unixTime * 1000); // 将秒转换为毫秒
    return date.toLocaleString('zh-CN', { hour12: false }); // 使用本地时间格式
  };

  const handleApprove = async id => {
    const res = await ctrl.approveRegister(id);
    if (res.isOk) {
      message.success(res.message);
    } else {
      message.warning(res.message);
    }
  };

  const handleReject = async id => {
    const res = await ctrl.rejectRegister(id, rejectReason);
    if (res.isOk) {
      message.success(res.message);
    } else {
      message.warning(res.message);
    }
    setCurrentRejectId(null);
  };

  const columns = [
    {
      title: '学号',
      dataIndex: 'stu_number',
      key: 'stu_number',
      fixed: 'left',
      width: 100,
    },
    {
      title: '车牌号',
      dataIndex: 'license_number',
      key: 'license_number',
      width: 30,
    },
    {
      title: '车辆类型',
      dataIndex: 'vehicle_type',
      key: 'vehicle_type',
      render: type => (type === 1 ? '电动车' : '摩托车'),
      width: 50,
    },
    {
      title: '登记日期',
      dataIndex: 'filing_date',
      key: 'filing_date',
      render: date => formatDate(date),
      width: 100,
    },
    {
      title: '学生证照片',
      dataIndex: 'stu_card_img',
      key: 'stu_card_img',
      render: img => <Image src={img} alt="学生证照片" width={100} height={100} />,
      width: 100,
    },
    {
      title: '车辆外观照片',
      dataIndex: 'vehicle_img',
      key: 'vehicle_img',
      render: img => <Image src={img} alt="车辆外观照片" width={100} height={100} />,
      width: 100,
    },
    {
      title: '车牌号照片',
      dataIndex: 'license_img',
      key: 'license_img',
      render: img => <Image src={img} alt="车牌号照片" width={100} height={100} />,
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <>
          <Space direction="vertical">
            <Button type="primary" size="small" onClick={() => handleApprove(record.id)}>
              审核通过
            </Button>
            <Popover
              content={
                <div style={{ width: 200 }}>
                  <Input.TextArea
                    rows={3}
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="请输入拒绝原因"
                  />
                  <div style={{ marginTop: 10, textAlign: 'right' }}>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => {
                        handleReject(record.id);
                      }}
                    >
                      确定
                    </Button>
                  </div>
                </div>
              }
              title="审核未通过"
              trigger="click"
            >
              <Button danger size="small">
                审核未通过
              </Button>
            </Popover>
          </Space>
        </>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={state.registerInfo}
      rowKey="id"
      scroll={{ scrollToFirstRowOnChange: true, y: 500 }}
      bordered
      size="small"
      style={{ width: 1000 }}
    />
  );
}
