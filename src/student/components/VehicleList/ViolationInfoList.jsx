import React from 'react';
import { useModelActions, useModelState } from 'react-imvc/hook';
import { Table } from 'antd';
import StatusTag from '../TagComponents/StatusTag';
import ViolationTagList from '../TagComponents/ViolationTagList';
import { formatUnixToYMD } from '../../../share/formatUnix';

export default ({ licenseNumber }) => {
  const state = useModelState();
  const actions = useModelActions();
  const { violationInfoList } = state;
  const computedViolationInfoList =
    violationInfoList?.filter(item => item.status !== 0 && item.license_number === licenseNumber) ?? [];

  const columns = [
    {
      key: 'detection_location',
      render: (_, record) => {
        return record.detection_location;
      },
    },
    {
      key: 'reporting_time',
      render: (_, record) => {
        return formatUnixToYMD(record.reporting_time);
      },
    },
    {
      key: 'status',
      render: (_, record) => <StatusTag status={record.status} />,
    },
    {
      key: 'violation_title',
      align: 'center',
      render: (_, record) => <ViolationTagList violationTitle={record.violation_title ?? []} />,
    },
  ];

  return (
    <>
      <div style={{ padding: '0 10px' }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={computedViolationInfoList}
          showHeader={false}
          pagination={false}
          onRow={record => {
            return {
              onClick: () => {
                actions.UPDATE_VIOLATIONINFOMODALDATA({
                  isModalOpen: true,
                  violationInfoId: record.id,
                });
              },
            };
          }}
        />
      </div>
    </>
  );
};
