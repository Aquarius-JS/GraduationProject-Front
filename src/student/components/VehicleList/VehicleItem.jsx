import React from 'react';
import { useCtrl } from 'react-imvc/hook';
import { Button, message, Collapse } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import ViolationInfoList from './ViolationInfoList';
import formatUnix from '../../../share/formatUnix';

export default ({ vehicle }) => {
  const ctrl = useCtrl();

  const [isExpanded, setIsExpanded] = React.useState(false);
  const statusMap = {
    0: '未提交',
    1: '审核中',
    2: '审核通过',
    3: '在校',
    4: '离校',
    5: '审核未通过',
    6: '取消登记',
  };

  return (
    <>
      <Collapse
        bordered={false}
        activeKey={isExpanded ? ['1'] : []}
        expandIcon={() => <></>}
        collapsible="icon"
        items={[
          {
            key: '1',
            label: (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: 800,
                }}
              >
                <div>
                  <h3>
                    <span
                      style={{
                        color: vehicle.vehicle_type === 1 ? '#4CAF50' : '#2196F3', // 绿色字体或蓝色字体
                        fontWeight: 'bold',
                      }}
                    >
                      {vehicle.vehicle_type === 1 ? '电动车' : '摩托车'} {vehicle.license_number}
                    </span>
                  </h3>
                  <p>登记日期: {formatUnix(vehicle.filing_date)}</p>
                  <p>车辆状态: {statusMap[vehicle.vehicle_status]}</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div>
                    <img src={vehicle.vehicle_img} alt="车辆外观照片" style={{ height: 100, objectFit: 'cover' }} />
                  </div>
                  <div>
                    {/* <p>车牌号照片:</p> */}
                    <img src={vehicle.license_img} alt="车牌号照片" style={{ height: 100, objectFit: 'cover' }} />
                  </div>
                </div>
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}
                >
                  <Button
                    onClick={async () => {
                      const res = await ctrl.leavingRegister({ registerId: vehicle.id });
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
                  <Button
                    icon={<DownOutlined rotate={isExpanded ? 180 : 0} />}
                    onClick={() => setIsExpanded(!isExpanded)}
                  />
                </div>
              </div>
            ),
            children: <ViolationInfoList licenseNumber={vehicle.license_number} />,
          },
        ]}
      />
    </>
  );
};
