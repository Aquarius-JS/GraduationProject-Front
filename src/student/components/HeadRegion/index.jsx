import React, { useState } from 'react';
import { useModelState } from 'react-imvc/hook';
import { Avatar, Badge, Drawer } from 'antd';
import { UserOutlined, BellOutlined, LinkOutlined } from '@ant-design/icons';
import { formatUnixToDate } from '../../../share/formatUnix';

export default function () {
  const state = useModelState();
  const userInfo = state.userInfo;
  const violationInfoList = state.violationInfoList;
  const announcementBasicInfo = state.announcementBasicInfo;

  const [annDrawerSwitch, setAnnDrawerSwitch] = useState(false); //通知框开关
  return (
    <>
      <div className="header-container">
        <div className="avatar-container">
          <Badge
            count={violationInfoList?.reduce((count, item) => (item.have_read === 0 ? count + 1 : count), 0)}
            size="small"
            offset={[-2, 6]}
          >
            <Avatar size={40} icon={<UserOutlined />} src={userInfo?.user_img} />
          </Badge>
          <div className="avatar-text">
            <span>{userInfo?.user_name}</span>
            <span>{userInfo?.stu_number}</span>
          </div>
        </div>
        <div className="stu-header-right">
          <Avatar
            size={40}
            icon={<BellOutlined />}
            onClick={() => {
              setAnnDrawerSwitch(true);
            }}
          />
        </div>
      </div>
      <Drawer
        title="公告通知"
        onClose={() => {
          setAnnDrawerSwitch(false);
        }}
        open={annDrawerSwitch}
      >
        {announcementBasicInfo?.map(item => {
          return (
            <div
              className="announcement-item"
              key={item.id}
              onClick={() => {
                window.open(`/announcement/exhibition?announcementId=${item.id}`, '_blank');
              }}
            >
              <div className="announcement-title-container">
                <LinkOutlined /> <span className="announcement-title">{item.title}</span>
              </div>
              <span className="announcement-date">{`[${formatUnixToDate(item.publish_time)}]`}</span>
            </div>
          );
        })}
      </Drawer>
    </>
  );
}
