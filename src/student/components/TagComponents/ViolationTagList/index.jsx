import React from 'react';
import { Tag } from 'antd';

export default function ({ violationTitle }) {
  return violationTitle?.map(item => (
    <Tag
      color={item === '超载' ? 'red' : item === '超速' ? 'error' : item === '违停' ? 'volcano' : 'warning'}
      bordered={false}
      key={item}
    >
      {item}
    </Tag>
  ));
}
