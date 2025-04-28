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
          ? 'green'
          : status === 2
          ? 'gray'
          : status === 3
          ? 'warning'
          : status === 4
          ? 'gray'
          : status === 5
          ? 'green'
          : status === 6
          ? 'gray'
          : 'gray'
      }
    >
      {status === 0
        ? '待审核'
        : status === 1
        ? '正常'
        : status === 2
        ? '作废'
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
}
