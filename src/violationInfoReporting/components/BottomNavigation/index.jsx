import React from 'react';
import { useModelState, useModelActions } from 'react-imvc/hook';
import { getURLParameter, updateURLParameter } from '../../../share/url';
import { Layout, Menu } from 'antd';
import { CarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Footer } = Layout;

const items = [
  {
    label: '车辆信息查询',
    key: 'vehicle-info-query',
    icon: <ExclamationCircleOutlined />,
  },
  {
    label: '违规信息上报',
    key: 'violation-reporting',
    icon: <ExclamationCircleOutlined />,
  },
  {
    label: '未登记上报',
    key: 'unregistered-reporting',
    icon: <CarOutlined />,
  },
];

export default function () {
  const state = useModelState();
  const { tap } = state.urlParams;
  const actions = useModelActions();
  const handleMenuClick = async e => {
    updateURLParameter('tap', e.key);
    const params = await getURLParameter();
    actions.UPDATE_URLPARAMS(params);
  };

  return (
    <Footer className="footer-bar">
      <Menu
        className="footer-menu"
        items={items}
        mode="inline"
        onClick={handleMenuClick}
        defaultSelectedKeys={tap ?? 'vehicle-info-query'}
      />
    </Footer>
  );
}
