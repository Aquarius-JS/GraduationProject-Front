import React, { useState, useEffect } from 'react';
import { Card, Tabs, Switch, InputNumber, Table, Tag, Button, notification, Form, Layout } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Content, Sider } = Layout;

const Monitoring = () => {
  // 模拟实时车牌和速度数据
  const [vehicleData, setVehicleData] = useState([]);
  const [cameras, setCameras] = useState([
    { id: 1, name: '东一门' },
    { id: 2, name: '明理楼C座' },
  ]);
  const [loading, setLoading] = useState(false);

  // 设备配置项
  const [form] = Form.useForm();
  const [config, setConfig] = useState({
    isRunning: true,
    speedLimit: 30,
    illegalCheck: true,
    illegalRunning: true,
    unRegisteredCheck: true,
    unRegisteredRunning: true,
  });

  // 获取当前选中的摄像头索引
  const [selectedCamera, setSelectedCamera] = useState(cameras[0]);

  // 模拟实时数据更新
  useEffect(() => {
    let interval;

    if (config.isRunning) {
      interval = setInterval(() => {
        const newData = [
          {
            licensePlate: '川AA95823',
            speed: 8.2,
            isRes: false,
            camera: selectedCamera.name,
            timestamp: new Date().toLocaleTimeString(),

            isOverSpeed: false,
          },
        ];

        setVehicleData(newData);

        // 如果超速且违规检测启用，显示通知
        if (newData[0].isOverSpeed && config.illegalRunning) {
          notification.warning({
            message: '超速警告',
            description: `车牌号 ${newData[0].licensePlate} 超速，当前速度 ${newData[0].speed} km/h`,
            duration: 3,
          });
        }
      }, 3000); // 每3秒更新一次
    }

    return () => clearInterval(interval);
  }, [selectedCamera, config.isRunning, config.speedLimit, config.illegalRunning]);

  // 车辆表格列定义
  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 100,
    },
    {
      title: '车牌号',
      dataIndex: 'licensePlate',
      key: 'licensePlate',
      width: 120,
    },
    {
      title: '速度',
      dataIndex: 'speed',
      key: 'speed',
      render: text => `${text} km/h`,
      width: 100,
    },
    {
      title: '摄像头位置',
      dataIndex: 'camera',
      key: 'camera',
      width: 120,
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.isOverSpeed ? 'error' : 'success'}>{record.isOverSpeed ? '超速' : '正常'}</Tag>
      ),
      width: 80,
    },
  ];

  return (
    <Layout className="monitoring-layout">
      <Content className="monitoring-content">
        <Card title="毕设测试地点  监控画面">
          <div className="camera-feed-container">
            {/* 视频监控画面 */}
            <div className="camera-feed">
              {/* 使用视频元素模拟监控画面 */}
              <img src="http://localhost:3000/upload/2.jpg" alt="" width={900} height={500} />

              {/* 车辆识别信息 */}
              {vehicleData.length > 0 && (
                <div className="vehicle-info-overlay">
                  <div className="vehicle-info">
                    <div className="info-item">
                      <span className="label">车牌号：</span>
                      <span className="value">{vehicleData[0].licensePlate}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">速度：</span>
                      <span className="value">
                        {vehicleData[0].speed} km/h
                        {!vehicleData[0].isRes && (
                          <Tag color="warning" className="over-speed-tag" style={{ marginLeft: 8 }}>
                            未登记，已上报
                          </Tag>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </Content>

      <Sider width={320} className="config-sider">
        <Card title="设备配置" className="config-card">
          <Form
            form={form}
            layout="vertical"
            initialValues={config}
            on
            onFinish={values => {
              setConfig(values);
              notification.success({
                message: '配置已保存',
                description: '设备配置已成功更新',
                duration: 2,
              });
            }}
          >
            <Form.Item name="isRunning" valuePropName="checked" label="设备运行状态">
              <Switch />
            </Form.Item>

            <Form.Item
              name="speedLimit"
              label="速度限制"
              rules={[
                { required: true, message: '请输入速度限制' },
                { type: 'number', min: 1, max: 200, message: '速度限制应在1-200之间' },
              ]}
            >
              <InputNumber min={1} max={200} addonAfter="km/h" />
            </Form.Item>

            <Form.Item name="illegalCheck" valuePropName="checked" label="违规上报是否需要审核">
              <Switch />
            </Form.Item>

            <Form.Item name="illegalRunning" valuePropName="checked" label="违规检测是否启用">
              <Switch />
            </Form.Item>

            <Form.Item name="unRegisteredCheck" valuePropName="checked" label="未登记车辆上报是否需要审核">
              <Switch />
            </Form.Item>

            <Form.Item name="unRegisteredRunning" valuePropName="checked" label="未登记检测是否启用">
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                保存配置
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Sider>
    </Layout>
  );
};

export default Monitoring;
