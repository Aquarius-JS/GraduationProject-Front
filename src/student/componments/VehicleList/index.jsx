import React from 'react';
import { Table, message } from 'antd';
import { useModelState } from 'react-imvc/hook';

export default function () {
  const state = useModelState();
  const { vehicleInfo } = state;

  const columns = [
    {
      title: '车牌号',
      dataIndex: 'license_number',
      key: 'license_number',
    },
    {
      title: '车辆类型',
      dataIndex: 'vehicle_type',
      key: 'vehicle_type',
      render: text => (text === 1 ? '小轿车' : '电动车'),
    },
    {
      title: '车辆状态',
      dataIndex: 'vehicle_status',
      key: 'vehicle_status',
      render: text => (text === 1 ? '正常' : '异常'),
    },
    {
      title: '车辆照片',
      dataIndex: 'vehicle_img',
      key: 'vehicle_img',
    }
  ];

  return (
    <div>
      {/* {vehicleInfo.length === 0 && message.info('暂无数据')} */}
      <Table dataSource={vehicleInfo} columns={columns} rowKey="id" />
    </div>
  );
}
