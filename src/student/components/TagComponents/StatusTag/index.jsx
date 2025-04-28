import React from 'react';
import { Tag } from 'antd';

export default function ({ status }) {
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
}
