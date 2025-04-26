import React from 'react';
import { useModelActions, useModelState } from 'react-imvc/hook';
import { Button, Table, Tag, Space } from 'antd';
import formatUnix from '../../../share/formatUnix';

export default function () {
  const state = useModelState();
  const actions = useModelActions();
  const { violationInfoList } = state;
  const computedViolationInfoList = violationInfoList?.filter(item => item.status !== 0) ?? [];
  console.log(state);

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
      render: (_, record) => {
        return record.violation_title.map(item => {
          return (
            <Tag
              color={item === '超载' ? 'red' : item === '超速' ? 'error' : item === '违停' ? 'volcano' : 'warning'}
              bordered={false}
              key={item}
            >
              {item}
            </Tag>
          );
        });
      },
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
      render: (_, record) => {
        const status = record.status;
        return (
          <Tag
            color={
              status === 1
                ? 'warning'
                : status === 3
                ? 'blue'
                : status === 4
                ? 'green'
                : status === 5
                ? 'red'
                : status === 6
                ? 'green'
                : 'gray'
            }
            bordered={false}
            key={record.id}
          >
            {status === 1
              ? '待核销'
              : status === 3
              ? '申诉中'
              : status === 4
              ? '申诉通过'
              : status === 5
              ? '申诉未通过'
              : status === 6
              ? '已核销'
              : '其他'}
          </Tag>
        );
      },
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
