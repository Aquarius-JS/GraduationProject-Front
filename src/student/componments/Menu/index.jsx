import React from 'react';
import { Menu } from 'antd';
import { useModelState, useModelActions } from 'react-imvc/hook';
import { getURLParameter, updateURLParameter } from '../../../share/url';
import { CarOutlined, ContactsOutlined, ExceptionOutlined, UserOutlined } from '@ant-design/icons';

const items = [
  {
    key: 'mycar',
    label: '我的车辆',
    icon: <CarOutlined />,
  },
  {
    key: 'carregister',
    label: '车辆登记',
    icon: <ContactsOutlined />,
  },
  {
    key: 'illegalinfo',
    label: '违规信息',
    icon: <ExceptionOutlined />,
  },
  {
    key: 'personalinfo',
    label: '个人信息',
    icon: <UserOutlined />,
  },
];

export default function () {
  const modelState = useModelState();
  const actions = useModelActions();
  const onClick = e => {
    updateURLParameter('tap', e.key);
    const params = getURLParameter();
    actions.UPDATE_URLPARAMS(params);
  };
  return (
    <Menu
      onClick={onClick}
      style={{
        width: 200,
      }}
      defaultSelectedKeys={modelState.urlParams.tap ?? 'mycar'}
      mode="inline"
      items={items}
    />
  );
}
