import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, message, List, Steps, Empty, Modal, Card } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useCtrl, useModelActions, useModelState } from 'react-imvc/hook';
import fileToBase64 from '../../../share/fileToBase64';
import VehicleItem from './VehicleItem';

const { Option } = Select;

export default function VehicleRegistration() {
  const ctrl = useCtrl();
  const actions = useModelActions();
  const state = useModelState();
  const { vehicleInfo } = state;
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const vehicleInfoInProcess = vehicleInfo ?? []; // 登记流程中的信息

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
