import React, { useEffect, useState } from 'react';
import { useModelState } from 'react-imvc/hook';
import { Avatar, Badge, Drawer, Input, Spin, Empty } from 'antd';
import { UserOutlined, BellOutlined, LinkOutlined } from '@ant-design/icons';
import { formatUnixToDate } from '../../../share/formatUnix';
import { debounce } from 'lodash';

export default function () {
  const state = useModelState();
  const userInfo = state.userInfo;
  const violationInfoList = state.violationInfoList;
  const announcementBasicInfo = state.announcementBasicInfo;
  const [computedAnnBasicInfo, setComputedAnnBasicInfo] = useState([]); //公告通知列表
  const [annDrawerSwitch, setAnnDrawerSwitch] = useState(false); //通知框开关
  const [annIsSearching, setAnnIsSearching] = useState(false);

  useEffect(() => {
    setComputedAnnBasicInfo(announcementBasicInfo);
  }, [announcementBasicInfo]);

  const computeAnnBasicInfo = debounce(searchValue => { //TODO: fix防抖bug
    if (searchValue === '') {
      setComputedAnnBasicInfo(announcementBasicInfo);
    } else {
      setComputedAnnBasicInfo(announcementBasicInfo?.filter(item => item.title.includes(searchValue)) ?? []);
    }
    setAnnIsSearching(false);
  }, 1300);

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
        <Input
          size="small"
          placeholder="输入标题进行搜索"
          allowClear={true}
          className="announcement-search"
          onChange={e => {
            setAnnIsSearching(true);
            computeAnnBasicInfo(e.target.value);
          }}
        />
        <Spin spinning={annIsSearching}>
          <div className="announcement-list">
            {computedAnnBasicInfo?.map(item => {
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
            {computedAnnBasicInfo?.length === 0 && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="公告信息为空" />
            )}
          </div>
        </Spin>
      </Drawer>
    </>
  );
}
