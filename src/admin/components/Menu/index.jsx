import React from 'react';
import { useCtrl, useModelActions, useModelState } from 'react-imvc/hook';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { getURLParameter, updateURLParameter } from '../../../share/url';

const items = [
  {
    label: '登记信息',
    key: 'register_info',
    icon: <MailOutlined />,
  },
  {
    label: '通知公告',
    key: 'announcement',
    icon: <AppstoreOutlined />,
  },
];

export default function () {
  const state = useModelState();
  const { tap } = state.urlParams;
  const actions = useModelActions();

  const onClick = async e => {
    updateURLParameter('tap', e.key);
    const params = await getURLParameter();
    actions.UPDATE_URLPARAMS(params);
  };

  return <Menu defaultSelectedKeys={tap ?? 'register_info'} onClick={onClick} mode="horizontal" items={items} />;
}
