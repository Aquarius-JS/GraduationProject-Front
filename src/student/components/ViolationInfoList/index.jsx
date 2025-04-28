import React from 'react';
import { useModelActions, useModelState } from 'react-imvc/hook';
import { Button, Table, Tag, Space } from 'antd';
import StatusTag from '../TagComponents/StatusTag';
import ViolationTagList from '../TagComponents/ViolationTagList';
import formatUnix from '../../../share/formatUnix';

export default function () {
  const state = useModelState();
  const actions = useModelActions();
  const { violationInfoList } = state;
  const computedViolationInfoList = violationInfoList?.filter(item => item.status !== 0) ?? [];

  const columns = [
    {
      title: '车牌号',
      dataIndex: 'license_number',
      key: 'license_number',
      width: 200,
      align: 'center',
    },
    {
      title: '违规类型',
      key: 'violation_title',
      width: 260,
      align: 'center',
      render: (_, record) => <ViolationTagList violationTitle={record.violation_title} />,
    },
    {
      title: '违规地点',
      key: 'detection_location',
      dataIndex: 'detection_location',
      width: 300,
    },
    {
      title: '违规时间',
      key: 'reporting_time',
      width: 300,
      render: (_, record) => {
        return formatUnix(record.reporting_time);
      },
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      align: 'center',
      render: (_, record) => <StatusTag status={record.status} />,
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      align: 'center',
      render: (_, record) => {
        return (
          <Space>
            <Button
              size="small"
              color="magenta"
              variant="solid"
              onClick={() =>
                actions.UPDATE_VIOLATIONINFOMODALDATA({
                  isModalOpen: true,
                  violationInfoId: record.id,
                })
              }
            >
              详情
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <div className="violation-info-container">
        <Table
          columns={columns}
          dataSource={computedViolationInfoList}
          rowKey="id"
          bordered
          pagination={{ pageSize: 20 }}
          width={1000}
          scroll={{ scrollToFirstRowOnChange: true, y: 500, x: true }}
        />
      </div>
    </>
  );
}
