import React from 'react';
import { Button, List, message } from 'antd';
import { useCtrl, useModelState } from 'react-imvc/hook';
import VehicleItem from './VehicleItem';

export default function () {
  const ctrl = useCtrl();
  const state = useModelState();
  const { vehicleInfo } = state;
  const vehicleInfoOnSchool = vehicleInfo?.filter(item => item?.vehicle_status === 3) ?? [];

  const columns = [
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render: id => (
        <>

        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <List
        split={false}
        style={{ marginTop: 20 }}
        dataSource={vehicleInfoOnSchool}
        renderItem={item => (
          <List.Item>
            <VehicleItem vehicle={item} />
          </List.Item>
        )}
      />
    </div>
  );
}
