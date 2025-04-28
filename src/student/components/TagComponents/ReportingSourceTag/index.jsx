import React from 'react';
import { Tag } from 'antd';

export default function ({ reportingSource }) {
  return (
    <Tag bordered={false} color={reportingSource === 0 ? 'cyan' : reportingSource === 1 ? 'blue' : 'lime'}>
      {reportingSource === 0 ? '机器' : reportingSource === 1 ? '人工' : '其他'}
    </Tag>
  );
}
