import React, { useState } from 'react';
import { useCtrl, useModelState } from 'react-imvc/hook';
import { Table, Image, Button, Space, message, Popover, Input } from 'antd';
import formatUnix from '../../../share/formatUnix';

export default function () {
  const ctrl = useCtrl();
  const state = useModelState();
  const [rejectReason, setRejectReason] = useState('');

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
      title: '学生证照片',
      dataIndex: 'stu_card_img',
      key: 'stu_card_img',
      align: 'center',
      render: img => <Image src={img} alt="学生证照片" height={100} />,
      width: 150,
    },
    {
      title: '车辆外观照片',
      dataIndex: 'vehicle_img',
      key: 'vehicle_img',
      align: 'center',
      render: img => <Image src={img} alt="车辆外观照片" height={100} />,
      width: 150,
    },
    {
      title: '车牌号照片',
      dataIndex: 'license_img',
      key: 'license_img',
      align: 'center',
      render: img => <Image src={img} alt="车牌号照片" height={100} />,
      width: 150,
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
    </div>
  );
}
