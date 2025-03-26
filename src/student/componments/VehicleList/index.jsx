import React from 'react';
import { Button, Table, message } from 'antd';
import { useCtrl, useModelState } from 'react-imvc/hook';

export default function () {
  const ctrl = useCtrl();
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
      render: text => (text === 3 ? '在校' : '异常'),
    },
    {
      title: '车辆照片',
      dataIndex: 'vehicle_img',
      key: 'vehicle_img',
      render: dataUrl => <img height={100} src={dataUrl} />,
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render: id => (
        <>
          {console.log(id)}
          <Button
            onClick={async () => {
              const res = await ctrl.leavingRegister({ registerId: id });
              if (res.isOk) {
                message.success(res.message);
              } else {
                message.warning(res.message);
              }
              ctrl.getVehicleInfoByStuToken();
            }}
          >
            离校
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      {/* {vehicleInfo.length === 0 && message.info('暂无数据')} */}
      <Table dataSource={vehicleInfo?.filter(item => item?.vehicle_status === 3)} columns={columns} rowKey="id" />
    </div>
  );
}
