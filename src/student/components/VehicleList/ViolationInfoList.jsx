import React from 'react';
import { useModelState } from 'react-imvc/hook';
import { List } from 'antd';
import StatusTag from '../TagComponents/StatusTag';
import ViolationTagList from '../TagComponents/ViolationTagList';
import { formatUnixToYMD } from '../../../share/formatUnix';

export default ({ licenseNumber }) => {
  const state = useModelState();
  const { violationInfoList } = state;
  const computedViolationInfoList =
    violationInfoList?.filter(item => item.status !== 0 && item.license_number === licenseNumber) ?? [];

  return (
    <>
      <div style={{ padding: '0 20px' }}>
        <List
          dataSource={computedViolationInfoList}
          renderItem={item => (
            <List.Item>
              <div>
                <span>{item.detection_location}</span>
                <span>{formatUnixToYMD(item.reporting_time)}</span>
                <StatusTag status={item.status} />
              </div>
              <div>
                <ViolationTagList violationTitle={item.violation_title ?? []} />
              </div>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};
