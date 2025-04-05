import React, { useState } from 'react';
import { useCtrl } from 'react-imvc/hook';
import { Button, Input, Form, Select, Modal, Upload, Space, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import RegisterStep from './RegisterStep';
import formatUnix from '../../../share/formatUnix';

const { Option } = Select;

export default ({ vehicle }) => {
  const ctrl = useCtrl();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState(vehicle);

  const statusMap = {
    0: '未提交',
    1: '已登记',
    2: '审核流程中',
    3: '审核未通过',
    4: '审核通过',
    5: '成功',
  };

  const handleEditChange = (field, value) => {
    setEditedVehicle(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { license_number, vehicle_type, stu_card_img, vehicle_img, license_img } = editedVehicle;

    if (!license_number.trim()) {
      message.warning('车牌号不能为空');
      return;
    }
    if (!vehicle_type) {
      message.warning('请选择车辆类型');
      return;
    }
    if (!stu_card_img) {
      message.warning('请上传学生证照片');
      return;
    }
    if (!vehicle_img) {
      message.warning('请上传车辆外观照片');
      return;
    }
    if (!license_img) {
      message.warning('请上传车牌号照片');
      return;
    }
    console.log(editedVehicle);
    const res = await ctrl.modificationRegisterInfo({
      ...editedVehicle,
      registerId: editedVehicle.id,
    });
    if (res.isOk) {
      message.success(res.message);
    } else {
      message.warning(res.message);
    }
    ctrl.getVehicleInfoByStuToken();

    setIsModalVisible(false);
  };

  const handleUpload = (field, file) => {
    const reader = new FileReader();
    reader.onload = e => {
      handleEditChange(field, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 20,
        border: '1px solid #f0f0f0',
        padding: 10,
        borderRadius: 5,
        width: 800,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <h3>
            <span
              style={{
                color: vehicle.vehicle_type === 1 ? '#4CAF50' : '#2196F3', // 绿色字体或蓝色字体
                fontWeight: 'bold',
              }}
            >
              {vehicle.vehicle_type === 1 ? '电动车' : '摩托车'} {vehicle.license_number}
            </span>
          </h3>
          <p>登记日期: {formatUnix(vehicle.filing_date)}</p>
          <p>学号: {vehicle.stu_number}</p>
          <p>车辆状态: {statusMap[vehicle.vehicle_status]}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div>
            <p>学生证照片:</p>
            <img src={vehicle.stu_card_img} alt="学生证照片" style={{ height: 100, objectFit: 'cover' }} />
          </div>
          <div>
            <p>车辆外观照片:</p>
            <img src={vehicle.vehicle_img} alt="车辆外观照片" style={{ height: 100, objectFit: 'cover' }} />
          </div>
          <div>
            <p>车牌号照片:</p>
            <img src={vehicle.license_img} alt="车牌号照片" style={{ height: 100, objectFit: 'cover' }} />
          </div>
        </div>
      </div>
      {vehicle.vehicle_status === 0 && (
        <Space>
          <Button type="primary" size="small" onClick={() => setIsModalVisible(true)}>
            完善信息
          </Button>
          <Button
            type="default"
            size="small"
            onClick={async () => {
              const res = await ctrl.cancelRegister({ registerId: vehicle.id });
              if (res.isOk) {
                message.success(res.message);
              } else {
                message.warning(res.message);
              }
              ctrl.getVehicleInfoByStuToken();
            }}
          >
            取消登记
          </Button>
        </Space>
      )}
      <RegisterStep status={vehicle.vehicle_status} vehicle={vehicle} />

      <Modal
        title="编辑车辆信息"
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="提交"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item
            label="车牌号"
            validateStatus={!editedVehicle.license_number.trim() ? 'error' : ''}
            help={!editedVehicle.license_number.trim() ? '车牌号不能为空' : ''}
          >
            <Input
              value={editedVehicle.license_number}
              onChange={e => handleEditChange('license_number', e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="车辆类型"
            validateStatus={!editedVehicle.vehicle_type ? 'error' : ''}
            help={!editedVehicle.vehicle_type ? '请选择车辆类型' : ''}
          >
            <Select
              value={editedVehicle.vehicle_type}
              onChange={value => handleEditChange('vehicle_type', value)}
              style={{ width: '100%' }}
            >
              <Option value={1}>电动车</Option>
              <Option value={2}>摩托车</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="学生证照片"
            validateStatus={!editedVehicle.stu_card_img ? 'error' : ''}
            help={!editedVehicle.stu_card_img ? '请上传学生证照片' : ''}
          >
            <Space direction="vertical">
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={file => {
                  handleUpload('stu_card_img', file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>上传学生证照片</Button>
              </Upload>
              {editedVehicle.stu_card_img && (
                <img
                  src={editedVehicle.stu_card_img}
                  alt="学生证预览"
                  style={{ marginTop: 10, height: 100, objectFit: 'cover' }}
                />
              )}
            </Space>
          </Form.Item>
          <Form.Item
            label="车辆外观照片"
            validateStatus={!editedVehicle.vehicle_img ? 'error' : ''}
            help={!editedVehicle.vehicle_img ? '请上传车辆外观照片' : ''}
          >
            <Space direction="vertical">
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={file => {
                  handleUpload('vehicle_img', file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>上传车辆外观照片</Button>
              </Upload>
              {editedVehicle.vehicle_img && (
                <img
                  src={editedVehicle.vehicle_img}
                  alt="车辆外观预览"
                  style={{ marginTop: 10, height: 100, objectFit: 'cover' }}
                />
              )}
            </Space>
          </Form.Item>
          <Form.Item
            label="车牌号照片"
            validateStatus={!editedVehicle.license_img ? 'error' : ''}
            help={!editedVehicle.license_img ? '请上传车牌号照片' : ''}
          >
            <Space direction="vertical">
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={file => {
                  handleUpload('license_img', file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>上传车牌号照片</Button>
              </Upload>
              {editedVehicle.license_img && (
                <img
                  src={editedVehicle.license_img}
                  alt="车牌号预览"
                  style={{ marginTop: 10, height: 100, objectFit: 'cover' }}
                />
              )}
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
