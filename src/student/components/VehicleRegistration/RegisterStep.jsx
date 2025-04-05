import React from 'react';
import { message, Steps } from 'antd';
import { StopOutlined, LoadingOutlined } from '@ant-design/icons';
import { useCtrl } from 'react-imvc/hook';

const { Step } = Steps;

export default function ({ status, vehicle }) {
  const ctrl = useCtrl();

  // 获取当前进行中的状态所对应的进度条序号
  const getStepStatus = status => {
    const statusObj = {
      0: 0,
      1: 1,
      2: 2,
      3: 4,
      4: 4,
      5: 2,
      6: 10,
    };
    return statusObj[status];
  };

  return (
    <Steps
      current={getStepStatus(status)}
      size="small"
      status="process"
      type="default"
      labelPlacement="vertical"
      style={{ marginTop: 20, justifyContent: 'center' }}
    >
      {status === 0 && (
        <>
          <Step title="完善信息" icon={<LoadingOutlined />} />
          <Step title="信息审核" />
          <Step title="车辆进校" />
        </>
      )}
      {[1, 2, 3, 4, 5].includes(status) && <Step title="信息提交" />}

      {status === 1 && (
        <>
          <Step title="审核中" icon={<LoadingOutlined />} />
          <Step title="审核结果" />
          <Step title="车辆进校" />
        </>
      )}

      {status === 2 && (
        <>
          <Step title="审核通过" />
          <Step
            title="领取标识"
            icon={<LoadingOutlined />}
            description={
              <span
                style={{
                  color: 'rgb(22, 119, 255)',
                  cursor: 'pointer',
                  textDecoration: 'underline rgb(22, 119, 255)',
                }}
                onClick={async () => {
                  const res = await ctrl.confirmEnterSchool({ registerId: vehicle.id });
                  if (res.isOk) {
                    message.success(res.message);
                  } else {
                    message.warning(res.message);
                  }
                  ctrl.getVehicleInfoByStuToken();
                }}
              >
                确认进校
              </span>
            }
          />
          <Step title="车辆进校" />
        </>
      )}

      {(status === 3 || status === 4) && (
        <>
          <Step title="审核通过" />
          <Step title="领取标识" />
          <Step title="车辆进校" />
        </>
      )}

      {status === 4 && <Step title="已离校" status="finish" />}

      {status === 5 && (
        <Step
          title="审核未通过"
          status="error"
          style={{ width: 300 }}
          description={
            <>
              <span
                style={{ cursor: 'pointer', color: 'rgb(22, 119, 255)', textDecoration: 'underline rgb(22, 119, 255)' }}
                onClick={async () => {
                  const res = await ctrl.registerAgain({ registerId: vehicle.id });
                  if (res.isOk) {
                    message.success(res.message);
                  } else {
                    message.warning(res.message);
                  }
                  ctrl.getVehicleInfoByStuToken();
                }}
              >
                完善信息
              </span>
              <span
                style={{ cursor: 'pointer', color: 'gray', textDecoration: 'underline gray' }}
                onClick={async () => {
                  const res = await ctrl.cancelRegister({ registerId: vehicle.id });
                  if (res.isOk) {
                    message.success(res.message);
                  } else {
                    message.warning(res.message);
                  }
                  ctrl.getVehicleInfoByStuToken();
                }}
              >
                取消登记
              </span>
            </>
          }
        />
      )}
      {status === 6 && <Step title="取消登记" icon={<StopOutlined style={{ color: 'gray' }} />} />}
    </Steps>
  );
}
