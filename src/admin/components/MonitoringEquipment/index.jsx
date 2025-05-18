import React, { useEffect, useState } from 'react';
import { useCtrl, useModelActions, useModelState } from 'react-imvc/hook';
import { Style } from 'react-imvc/component';
import { Button, Modal, Form, Input, Select, Space, message, Switch } from 'antd';
import MEItem from './MEItem';

export default function MonitoringEquipment() {
  const ctrl = useCtrl();
  const state = useModelState();
  const actions = useModelActions();
  const { monitoringEquipment } = state;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meType, setMeType] = useState();
  const [meName, setMeName] = useState('');
  const [meSn, setMeSn] = useState('');
  const [meLocation, setMeLocation] = useState('');
  const [meIp, setMeIp] = useState('');
  const [isRunning, setIsRunning] = useState(true);
  const [unRegisteredRunning, setUnRegisteredRunning] = useState(true);
  const [illegalRunning, setIllegalRunning] = useState(true);
  const [speedLimit, setSpeedLimit] = useState(30);
  const [unRegisteredCheck, setUnRegisteredCheck] = useState(true);
  const [illegalCheck, setIllegalCheck] = useState(true);

  const [testLoading, setTestLoading] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const handleOk = async () => {
    const res = await ctrl.addMonitoringEquipment({
      type: meType[0],
      name: meName,
      ip: meIp,
      sn: meSn,
      location: meLocation,
      rules: { isRunning, unRegisteredRunning, illegalRunning, unRegisteredCheck, illegalCheck, speedLimit },
    });
    if (res.code === 200) {
      message.success(res.message);
      ctrl.getMonitoringEquipment();
    } else {
      message.warning(res.message);
    }
    setIsModalOpen(false);
  };

  const handleTestConnection = () => {
    setTestLoading(true);
    // 模拟连接测试
    setTimeout(() => {
      setTestLoading(false);
      setTestSuccess(true);
      message.success('连接成功！');
      // 3秒后恢复按钮状态
      setTimeout(() => {
        setTestSuccess(false);
      }, 3000);
    }, 1000); // 模拟1秒的加载时间
  };

  useEffect(() => {
    ctrl.getMonitoringEquipment();
  }, []);

  return (
    <>
      <Style name="me" />
      <div className="me-container">
        <Button
          type="primary"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          新增设备
        </Button>
        <div className="me-list">
          {monitoringEquipment?.map(item => {
            return <MEItem key={item.id} meData={item} />;
          })}
        </div>
        <Modal
          title="新增设备"
          width={800}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
          }}
          footer={
            <Button type="primary" onClick={handleOk}>
              添加
            </Button>
          }
        >
          <Form name="me">
            <div className="me-form">
              <Form.Item label="设备类型" name="type" rules={[{ required: true, message: '请选择设备类型' }]}>
                <Select
                  value={meType}
                  onChange={value => setMeType(value)}
                  className="me-form-item"
                  placeholder="设备类型"
                  allowClear
                  mode="tags"
                  maxCount={1}
                  tokenSeparators={[',']}
                >
                  <Select.Option value="海康威视">海康威视</Select.Option>
                  <Select.Option value="大华">大华</Select.Option>
                  <Select.Option value="华为">华为</Select.Option>
                  <Select.Option value="萤石">萤石</Select.Option>
                  <Select.Option value="其他">其他</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="设备名称" name="name" rules={[{ required: true, message: '请输入设备名称' }]}>
                <Input className="me-form-item" value={meName} onChange={e => setMeName(e.target.value)} />
              </Form.Item>
              <Form.Item label="S/N 号" name="sn" rules={[{ required: true, message: '请输入设备sn号' }]}>
                <Input className="me-form-item" value={meSn} onChange={e => setMeSn(e.target.value)} />
              </Form.Item>
              <Form.Item label="安装位置" name="位置" rules={[{ required: true, message: '请输入设备位置' }]}>
                <Input className="me-form-item" value={meLocation} onChange={e => setMeLocation(e.target.value)} />
              </Form.Item>
            </div>
            <Form.Item label="设备URL" name="ip" rules={[{ required: true, message: '请输入设备url并测试' }]}>
              <div className="me-url-container">
                <Input className="me-form-item" value={meIp} onChange={e => setMeIp(e.target.value)} />
                <Button
                  type="primary"
                  onClick={handleTestConnection}
                  loading={testLoading}
                  className={testSuccess ? 'success-button' : ''}
                >
                  测试连接
                </Button>
              </div>
            </Form.Item>
            <Form.Item label="设备规则" name="rules" rules={[{ required: true, message: '设备检测规则' }]}>
              <Space direction="vertical" className="me-rules-container">
                <div>
                  <span>是否启用:</span>
                  <Switch checked={isRunning} onChange={setIsRunning} defaultChecked={true} />
                </div>
                {isRunning && (
                  <>
                    <div>
                      <span>未登记车辆检测:</span>
                      <Switch checked={unRegisteredRunning} onChange={setUnRegisteredRunning} defaultChecked={true} />
                    </div>
                    {unRegisteredRunning && (
                      <div>
                        <span>未登记车辆检测是否需要核查:</span>
                        <Switch checked={unRegisteredCheck} onChange={setUnRegisteredCheck} defaultChecked={true} />
                      </div>
                    )}
                    <div>
                      <span>违规车辆检测:</span>
                      <Switch checked={illegalRunning} onChange={setIllegalRunning} defaultChecked={true} />
                      {illegalRunning && (
                        <Input
                          value={speedLimit}
                          onChange={e => {
                            setSpeedLimit(e.target.value);
                          }}
                          type="number"
                          placeholder="车速限制"
                          suffix="km/h"
                          size="small"
                          style={{ width: '200px', marginLeft: '20px' }}
                        />
                      )}
                    </div>
                    {illegalRunning && (
                      <div>
                        <span>违规信息是否需要核查:</span>
                        <Switch checked={illegalCheck} onChange={setIllegalCheck} defaultChecked={true} />
                      </div>
                    )}
                  </>
                )}
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}
