import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useModelActions, useModelState } from 'react-imvc/hook';

const { Option } = Select;

export default function () {
  const actions = useModelActions();
  const state = useModelState();
  const { vehicleInfo } = state;
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState({
    studentCard: [],
    vehicleAppearance: [],
    licensePlate: [],
  });

  const handleSubmit = async values => {
    try {
      const newVehicle = {
        ...values,
        student_card_img: fileList.studentCard.length > 0 ? fileList.studentCard[0].url : null,
        vehicle_appearance_img: fileList.vehicleAppearance.length > 0 ? fileList.vehicleAppearance[0].url : null,
        license_plate_img: fileList.licensePlate.length > 0 ? fileList.licensePlate[0].url : null,
      };
      actions.ADD_VEHICLE(newVehicle);
      message.success('车辆登记成功');
      form.resetFields();
      setFileList({
        studentCard: [],
        vehicleAppearance: [],
        licensePlate: [],
      });
    } catch (error) {
      message.error('车辆登记失败');
    }
  };

  const handleUploadChange = (info, type) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // 只保留最新上传的文件
    newFileList = newFileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(prevState => ({ ...prevState, [type]: newFileList }));
  };

  const beforeUpload = file => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('图片大小不能超过10MB!');
    }
    return isImage && isLt10M;
  };

  return (
    <Card title="车辆登记" style={{ width: 600, margin: '50px auto' }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="license_number" label="车牌号" rules={[{ required: true, message: '请输入车牌号' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="vehicle_type" label="车辆类型" rules={[{ required: true, message: '请选择车辆类型' }]}>
          <Select>
            <Option value={1}>小轿车</Option>
            <Option value={2}>电动车</Option>
          </Select>
        </Form.Item>
        <Form.Item name="vehicle_status" label="车辆状态" rules={[{ required: true, message: '请选择车辆状态' }]}>
          <Select>
            <Option value={1}>正常</Option>
            <Option value={2}>异常</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="student_card_img"
          label="学生证照片"
          valuePropName="fileList"
          getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload
            name="student_card_img"
            listType="picture"
            className="upload-list-inline"
            action="/uploadStudentCardImage" // 替换为实际的上传接口
            beforeUpload={beforeUpload}
            onChange={info => handleUploadChange(info, 'studentCard')}
          >
            <Button icon={<UploadOutlined />}>上传学生证照片</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="vehicle_appearance_img"
          label="车辆外观照片"
          valuePropName="fileList"
          getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload
            name="vehicle_appearance_img"
            listType="picture"
            className="upload-list-inline"
            action="/uploadVehicleAppearanceImage" // 替换为实际的上传接口
            beforeUpload={beforeUpload}
            onChange={info => handleUploadChange(info, 'vehicleAppearance')}
          >
            <Button icon={<UploadOutlined />}>上传车辆外观照片</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="license_plate_img"
          label="车牌号照片"
          valuePropName="fileList"
          getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload
            name="license_plate_img"
            listType="picture"
            className="upload-list-inline"
            action="/uploadLicensePlateImage" // 替换为实际的上传接口
            beforeUpload={beforeUpload}
            onChange={info => handleUploadChange(info, 'licensePlate')}
          >
            <Button icon={<UploadOutlined />}>上传车牌号照片</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            登记车辆
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
