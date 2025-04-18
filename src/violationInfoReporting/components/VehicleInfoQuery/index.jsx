import React, { useState } from 'react';
import { useCtrl, useModelActions, useModelState } from 'react-imvc/hook';
import { Input, message, Modal, Button, Tag, Divider, Spin } from 'antd';
import { WarningOutlined, PlusOutlined } from '@ant-design/icons';
import { getURLParameter, updateURLParameter } from '../../../share/url';
import formatUnix from '../../../share/formatUnix';

export default function () {
  const ctrl = useCtrl();
  const actions = useModelActions();
  const state = useModelState();
  const { searchValue, searchResults, isSearched } = state;
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await Promise.all([
      ctrl.getVehicleRegisterInfoByLicense(searchValue),
      ctrl.getVehicleRegisterInfoByStuNumber(searchValue),
    ]);
    const list = res.filter(item => item.isOk === true).reduce((a, b) => a.concat(b.data), []);
    actions.UPDATE_SEARCHRESULTS(list);
    actions.UPDATE_ISSEARCHED(true);
    setLoading(false);
  };

  const handleVehicleClick = vehicle => {
    setSelectedVehicle(vehicle);
    setIsModalVisible(true);
  };

  const handleReportViolation = async () => {
    updateURLParameter('tap', 'violation-reporting');
    updateURLParameter('license_number', selectedVehicle.license_number);
    const params = await getURLParameter();
    actions.UPDATE_URLPARAMS(params);
  };

  const vehicleStatusMap = {
    0: { text: '未提交', color: 'warning' },
    1: { text: '已提交', color: 'blue' },
    2: { text: '审核通过', color: 'success' },
    3: { text: '在校', color: 'blue' },
    4: { text: '离校', color: 'warning' },
    5: { text: '审批未通过', color: 'error' },
    6: { text: '取消登记', color: 'default' },
  };

  return (
    <div className="vehicle-search-container">
      <div className="search-bar">
        <Input.Search
          className="search-input"
          style={{ width: '100%' }}
          placeholder="请输入车牌号或学号"
          enterButton="搜索"
          value={searchValue}
          onChange={e => {
            const newChar = e.target.value.toUpperCase();
            actions.UPDATE_SEARCHVALUE(newChar);
          }}
          onSearch={handleSearch}
          loading={loading}
        />
        {searchValue.includes('I') || searchValue.includes('O') ? (
          <div className="invalid-input-warning">
            <WarningOutlined style={{ marginRight: 5, marginTop: 10, color: '#faad14' }} />
            车牌号不包含字母I、O
          </div>
        ) : null}
      </div>

      <Spin spinning={loading} size="large" tip="加载中..." style={{ height: 200 }}>
        {isSearched && searchResults.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="#d9d9d9">
                <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
              </svg>
            </div>
            <div className="no-results-text">
              没有找到相关车辆信息
              <Button
                type="link"
                size="small"
                onClick={async () => {
                  updateURLParameter('tap', 'unregistered-reporting');
                  const params = await getURLParameter();
                  actions.UPDATE_URLPARAMS(params);
                }}
              >
                去上报
              </Button>
            </div>
          </div>
        ) : null}

        {searchResults.length > 0 && (
          <div className="results-container">
            <ItemList searchResults={searchResults} onVehicleClick={handleVehicleClick} />
          </div>
        )}
      </Spin>

      {selectedVehicle && (
        <Modal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setIsModalVisible(false)}>
              返回
            </Button>,
            <Button key="report" type="primary" onClick={handleReportViolation} icon={<PlusOutlined />}>
              添加违规信息
            </Button>,
          ]}
          className="vehicle-detail-modal"
        >
          <div className="vehicle-detail">
            {/* 信息部分 */}
            <div className="detail-item">
              <span className="label">申请表ID:</span>
              <span className="value">{selectedVehicle.id}</span>
            </div>
            <div className="vehicle-info">
              <div className="detail-item">
                <span className="label">车牌号:</span>
                <span className="value">{selectedVehicle.license_number}</span>
              </div>
              <div className="detail-item">
                <span className="label">车主学号:</span>
                <span className="value">{selectedVehicle.stu_number}</span>
              </div>
              <div className="detail-item">
                <span className="label">车辆类型:</span>
                <span className="value">{selectedVehicle.vehicle_type === 1 ? '电动车' : '摩托车'}</span>
              </div>
              <div className="detail-item">
                <span className="label">状态:</span>
                <Tag color={vehicleStatusMap[selectedVehicle.vehicle_status]?.color}>
                  {vehicleStatusMap[selectedVehicle.vehicle_status]?.text}
                </Tag>
              </div>
              <div className="detail-item">
                <span className="label">登记日期:</span>
                <span className="value">{formatUnix(selectedVehicle.filing_date)}</span>
              </div>
            </div>

            {/* 图片部分 */}
            <div className="vehicle-images">
              <div className="detail-item">
                <span className="label">车辆照片:</span>
                <img
                  src={selectedVehicle.vehicle_img || '/default-vehicle.png'}
                  alt="车辆照片"
                  className="detail-image"
                />
              </div>
              <Divider />
              <div className="detail-item">
                <span className="label">车牌照片:</span>
                <img
                  src={selectedVehicle.license_img || '/default-license.png'}
                  alt="车牌照片"
                  className="detail-image"
                />
              </div>
              <Divider />
              <div className="detail-item">
                <span className="label">学生卡照片:</span>
                <img
                  src={selectedVehicle.stu_card_img || '/default-student.png'}
                  alt="学生卡照片"
                  className="detail-image"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

const ItemList = ({ searchResults, onVehicleClick }) => {
  return (
    <div className="results-list">
      {searchResults?.map(vehicle => (
        <div key={vehicle.license_number} className="vehicle-item" onClick={() => onVehicleClick(vehicle)}>
          <div className="vehicle-info">
            <div className="vehicle-type">
              <span
                className="vehicle-type-text"
                style={{
                  color: vehicle.vehicle_type === 1 ? '#4CAF50' : '#2196F3',
                }}
              >
                {vehicle.vehicle_type === 1 ? '电动车' : '摩托车'} {vehicle.license_number}
              </span>
            </div>
            <div className="vehicle-stu-number">学号: {vehicle.stu_number}</div>
            <div className="vehicle-status">
              状态:
              {vehicle.vehicle_status === 0 ? (
                <span className="status-text status-unsubmitted">未提交</span>
              ) : vehicle.vehicle_status === 1 ? (
                <span className="status-text status-submitted">已提交</span>
              ) : vehicle.vehicle_status === 2 ? (
                <span className="status-text status-approved">审核通过</span>
              ) : vehicle.vehicle_status === 3 ? (
                <span className="status-text status-on-campus">在校</span>
              ) : vehicle.vehicle_status === 4 ? (
                <span className="status-text status-off-campus">离校</span>
              ) : vehicle.vehicle_status === 5 ? (
                <span className="status-text status-denied">审批未通过</span>
              ) : vehicle.vehicle_status === 6 ? (
                <span className="status-text status-cancelled">取消登记</span>
              ) : (
                <span className="status-text">其他</span>
              )}
            </div>
          </div>
          <div className="vehicle-image">
            <img src={vehicle.vehicle_img} alt={vehicle.license_number} />
          </div>
        </div>
      ))}
    </div>
  );
};
