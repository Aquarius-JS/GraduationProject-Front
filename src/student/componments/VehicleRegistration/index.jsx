import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, message, List, Steps, Empty, Modal } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useCtrl, useModelActions, useModelState } from 'react-imvc/hook';
import fileToBase64 from '../../../share/fileToBase64';

const { Option } = Select;
const { Step } = Steps;

export default function VehicleRegistration() {
  const ctrl = useCtrl();
  const actions = useModelActions();
  const state = useModelState();
  console.log(state);
  const { vehicleInfo } = state;
  console.log(vehicleInfo);
  const [form] = Form.useForm();
  const [vehicles, setVehicles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        setIsModalVisible(false);
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error('车辆登记失败');
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const customRequest = async options => {
    const fileBuffer = options.file;
    console.log(fileBuffer instanceof File);
    if (!fileBuffer) {
      return reject(new Error('No file uploaded'));
    }
    const dataUrl = await fileToBase64(fileBuffer);
    console.log(dataUrl);
    options.onSuccess();
    return dataUrl;
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        添加新车辆登记
      </Button>
      <Modal title="添加新车辆登记" visible={isModalVisible} onCancel={handleCancel} footer={null}>
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
          <Form.Item name="stu_card_img" label="学生证照片">
            <Upload name="stu_card_img" listType="picture" customRequest={customRequest}>
              <Button icon={<UploadOutlined />}>上传学生证照片</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="vehicle_img" label="车辆外观照片">
            <Upload name="vehicle_img" listType="picture" customRequest={customRequest}>
              <Button icon={<UploadOutlined />}>上传车辆外观照片</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="license_img" label="车牌号照片">
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
      {/* {vehicleInfo?.length === 0 ? (
        <Empty description="还未登记任何车辆，去登记吧" />
      ) : (
        <List
          header={<div>已添加的车辆</div>}
          bordered
          dataSource={vehicleInfo}
          renderItem={(item, index) => (
            <List.Item>
              <div style={{ flex: 1 }}>
                {item.license_number} - {item.vehicle_type === 1 ? '电动车' : '摩托车'}
                <Steps current={item.step} size="small" style={{ marginTop: 10 }}>
                  <Step title="添加车辆" />
                  <Step title="确认提交" />
                </Steps>
              </div>
              {item.step === 0 && (
                <Button type="primary" onClick={() => handleNextStep(index)}>
                  下一步
                </Button>
              )}
            </List.Item>
          )}
        />
      )}
      {vehicleInfo?.length > 0 && vehicleInfo?.every(vehicle => vehicle.step > 0) && (
        <Button type="primary" onClick={handleSubmit} style={{ marginTop: 20 }}>
          提交申请
        </Button>
      )} */}
    </div>
  );
}
