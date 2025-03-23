import React from 'react';
import { Steps } from 'antd';
import { StopOutlined, LoadingOutlined } from '@ant-design/icons';

const { Step } = Steps;

export default function ({ status }) {
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
          <Step title="领取标识" icon={<LoadingOutlined />} />
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

      {status === 5 && <Step title="审核未通过" status="error" />}
      {status === 6 && <Step title="取消登记" icon={<StopOutlined style={{ color: 'gray' }} />} />}
    </Steps>
  );
}
