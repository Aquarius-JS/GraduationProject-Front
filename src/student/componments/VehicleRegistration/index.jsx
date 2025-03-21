import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, message, List, Steps, Empty, Modal, Card } from 'antd';
import { UploadOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useCtrl, useModelActions, useModelState } from 'react-imvc/hook';
import fileToBase64 from '../../../share/fileToBase64';

const { Option } = Select;
const { Step } = Steps;

export default function VehicleRegistration() {
  const ctrl = useCtrl();
  const actions = useModelActions();
  const state = useModelState();
  const { vehicleInfo } = state;
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const vehicleInfoInProcess = vehicleInfo?.filter(item => item.vehicle_status !== 5) ?? []; // 登记流程中的信息

  const handleAddVehicle = async values => {
    try {
      const stuImg = await fileToBase64(values.stu_card_img.file.originFileObj);
      const vehicleImg = await fileToBase64(values.vehicle_img.file.originFileObj);
      const licenseImg = await fileToBase64(values.license_img.file.originFileObj);
      const json = {
        ...values,
        stu_card_img: stuImg,
        vehicle_img: vehicleImg,
        license_img: licenseImg,
      };
      const res = await ctrl.vehicleRegistration(json);
      if (res.isOk) {
        message.success(res.message);
        form.resetFields();
        setIsModalVisible(false);
        ctrl.getVehicleInfoByStuToken();
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error('车辆登记失败');
    }
  };

  const customRequest = async options => {
    options.onSuccess();
  };

  return (
    <div style={{ padding: '20px' }}>
      {vehicleInfoInProcess.length > 0 ? (
        <>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            添加新车辆登记
          </Button>
          <List
            split={false}
            style={{ marginTop: 20 }}
            dataSource={vehicleInfoInProcess}
            renderItem={item => (
              <List.Item>
                <VehicleItem vehicle={item} />
              </List.Item>
            )}
          />
        </>
      ) : (
        <Empty
          description={
            <span>
              还未登记任何车辆，去
              <Button type="link" onClick={() => setIsModalVisible(true)}>
                登记
              </Button>
            </span>
          }
        />
      )}
      <Modal title="添加新车辆登记" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAddVehicle}>
          <Form.Item name="license_number" label="车牌号" rules={[{ required: true, message: '请输入车牌号' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="vehicle_type" label="车辆类型" rules={[{ required: true, message: '请选择车辆类型' }]}>
            <Select>
              <Option value={1}>电动车</Option>
              <Option value={2}>摩托车</Option>
            </Select>
          </Form.Item>
          <Form.Item name="stu_card_img" label="学生证照片" rules={[{ required: true, message: '请上传学生证照片' }]}>
            <Upload name="stu_card_img" listType="picture" customRequest={customRequest}>
              <Button icon={<UploadOutlined />}>上传学生证照片</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="vehicle_img" label="车辆外观照片" rules={[{ required: true, message: '请上传车辆照片' }]}>
            <Upload name="vehicle_img" listType="picture" customRequest={customRequest}>
              <Button icon={<UploadOutlined />}>上传车辆外观照片</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="license_img" label="车牌号照片" rules={[{ required: true, message: '请上传车牌号照片' }]}>
            <Upload name="license_img" listType="picture" customRequest={customRequest}>
              <Button icon={<UploadOutlined />}>上传车牌号照片</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              添加车辆
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const VehicleItem = ({ vehicle }) => {
  const statusMap = {
    0: '未提交',
    1: '已登记',
    2: '审核流程中',
    3: '审核未通过',
    4: '审核通过',
    5: '成功',
  };

  // 将 Unix 时间戳转换为年月日时分秒格式
  const formatDate = unixTime => {
    const date = new Date(unixTime * 1000); // 将秒转换为毫秒
    return date.toLocaleString('zh-CN', { hour12: false }); // 使用本地时间格式
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
          <p>登记日期: {formatDate(vehicle.filing_date)}</p>
          <p>学号: {vehicle.stu_number}</p>
          <p>车辆状态: {statusMap[vehicle.vehicle_status]}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div>
            <p>学生证照片:</p>
            <img src={vehicle.stu_card_img} alt="学生证照片" style={{ width: 100, height: 100, objectFit: 'cover' }} />
          </div>
          <div>
            <p>车辆外观照片:</p>
            <img src={vehicle.vehicle_img} alt="车辆外观照片" style={{ width: 100, height: 100, objectFit: 'cover' }} />
          </div>
          <div>
            <p>车牌号照片:</p>
            <img src={vehicle.license_img} alt="车牌号照片" style={{ width: 100, height: 100, objectFit: 'cover' }} />
          </div>
        </div>
        {/* {vehicle.vehicle_status === 1 && (
          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button type="primary" onClick={() => onSubmit(vehicle.id)}>
              提交
            </Button>
            <Button danger onClick={() => onDelete(vehicle.id)}>
              删除
            </Button>
          </div>
        )} */}
      </div>
      <Steps
        current={vehicle.vehicle_status}
        size="small"
        style={{ marginTop: 20 }}
        status="process"
        type="default"
        labelPlacement="vertical"
      >
        {/* TODO: 流程信息完善 */}
        <Step title="信息提交" />
        <Step title="审核信息" icon={<LoadingOutlined />} />
        <Step title="审核通过" />
        <Step title="成功" />
      </Steps>
    </div>
  );
};
