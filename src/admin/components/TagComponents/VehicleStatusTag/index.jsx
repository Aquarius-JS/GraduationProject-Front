import React from 'react';
import { Tag } from 'antd';

export default function ({ status }) {
  return (
    <Tag
      bordered={false}
      color={
        status === 0
          ? 'warning'
          : status === 1
          ? 'warning'
          : status === 2
          ? 'green'
          : status === 3
          ? 'green'
          : status === 4
          ? 'gray'
          : status === 5
          ? 'red'
          : status === 6
          ? 'gray'
          : 'gray'
      }
    >
      {status === 0
        ? '待完善信息'
        : status === 1
        ? '审核中'
        : status === 2
        ? '审核通过'
        : status === 3
        ? '在校'
        : status === 4
        ? '已登记离校'
        : status === 5
        ? '审核未通过'
        : status === 6
        ? '已取消登记'
        : '其他'}
    </Tag>
  );
}
