import React, { useEffect, useState } from 'react';
import { useModelActions, useModelState } from 'react-imvc/hook';
import { Avatar, Button, Badge, Drawer, Input, Spin, Empty, Card, Tag, Divider } from 'antd';
import { UserOutlined, BellOutlined, LinkOutlined } from '@ant-design/icons';
import formatUnix, { formatUnixToDate } from '../../../share/formatUnix';
import { debounce } from 'lodash';

export default function () {
  const state = useModelState();
  const actions = useModelActions();
  const userInfo = state.userInfo;
  const violationInfoList = state.violationInfoList;
  const notReadAndStatusNormalViolationInfoList = violationInfoList?.filter(
    item => item.have_read === 0 && item.status !== 0
  );
  const announcementBasicInfo = state.announcementBasicInfo;
  const [computedAnnBasicInfo, setComputedAnnBasicInfo] = useState([]); //公告通知列表
  const [annDrawerSwitch, setAnnDrawerSwitch] = useState(false); //通知框开关
  const [sysNoticeDrawerSwitch, setSysNoticeDrawerSwitch] = useState(false);
  const [annIsSearching, setAnnIsSearching] = useState(false);

  useEffect(() => {
    setComputedAnnBasicInfo(announcementBasicInfo);
  }, [announcementBasicInfo]);

  const computeAnnBasicInfo = debounce(searchValue => {
    //TODO: fix防抖bug
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
          <Badge count={notReadAndStatusNormalViolationInfoList?.length ?? 0} size="small" offset={[-2, 6]}>
            <Avatar
              size={40}
              icon={<UserOutlined />}
              src={userInfo?.user_img}
              onClick={() => {
                setSysNoticeDrawerSwitch(true);
              }}
            />
          </Badge>
          <div className="avatar-text">
            <span>{userInfo?.user_name}</span>
            <span>{userInfo?.stu_number}</span>
          </div>
        </div>
        <div className="stu-header-right">
          <Avatar
            size={35}
            icon={<BellOutlined />}
            onClick={() => {
              setAnnDrawerSwitch(true);
            }}
          />
        </div>
      </div>
      <Drawer
        className="vio-drawer"
        title="系统消息"
        placement="left"
        onClose={() => {
          setSysNoticeDrawerSwitch(false);
        }}
        open={sysNoticeDrawerSwitch}
      >
        {notReadAndStatusNormalViolationInfoList?.length > 0 ? (
          <Divider className="vio-title" orientation="start">
            <span>违规信息：</span>
          </Divider>
        ) : null}
        {notReadAndStatusNormalViolationInfoList?.map(item => {
          return (
            <Card className="vio-sys-notice" size="small" hoverable={true}>
              <div className="vio-notice-top">
                <span className="vio-license-container">
                  <span className="vio-license-label vio-sys-notice-label">车牌号</span>
                  <span className="vio-license-number">{item.license_number}</span>
                </span>
                <Button
                  size="small"
                  color="primary"
                  variant="link"
                  onClick={() => {
                    console.log('!!!', item.id);
                    actions.UPDATE_VIOLATIONINFOMODALDATA({
                      isModalOpen: true,
                      violationInfoId: item.id,
                    });
                  }}
                >
                  详情
                </Button>
              </div>
              <div className="vio-notice-main">
                <span className="vio-reporting-time-container">
                  <span className="vio-reporting-time-label vio-sys-notice-label">时间</span>
                  <span className="vio-reporting-time">{formatUnix(item.reporting_time)}</span>
                </span>
                <span className="vio-reporting-location-container">
                  <span className="vio-reporting-locationlabel vio-sys-notice-label">地点</span>
                  <span className="vio-reporting-location">{item.detection_location}</span>
                </span>
                <span className="vio-type-container">
                  <span className="vio-sys-notice-label">类型</span>
                  <span className="vio-type-list">
                    {item.violation_title.map(vio => {
                      return (
                        <Tag
                          color={
                            vio === '超载' ? 'red' : vio === '超速' ? 'error' : vio === '违停' ? 'volcano' : 'warning'
                          }
                          bordered={false}
                          key={vio}
                        >
                          {vio}
                        </Tag>
                      );
                    })}
                  </span>
                </span>
              </div>
            </Card>
          );
        })}
      </Drawer>
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
