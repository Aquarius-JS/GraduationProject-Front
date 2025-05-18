import React, { useState } from 'react';
import { useCtrl } from 'react-imvc/hook';
import { Card, Row, Col, Tag, Badge, Button, Drawer, Form, Switch, Space, Input, message, Modal } from 'antd';
import { SettingOutlined, DeleteOutlined, VideoCameraOutlined } from '@ant-design/icons';

export default function MEItem({ meData }) {
  const ctrl = useCtrl();
  const {
    name,
    id,
    type,
    ip,
    location,
    sn,
    rules: {
      isRunning = true, // 是否启用
      illegalCheck = true, // 违规车辆核查
      illegalRunning = true, // 违规检测启用
      unRegisteredCheck = true, // 未登记车辆核查
      unRegisteredRunning = true, // 未登记检测启用
      speedLimit = 30, // 车速限制
    } = {},
  } = meData;

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  // 渲染状态标签
  const renderStatusTags = () => {
    const tags = [
      { key: 'isRunning', color: isRunning ? 'green' : 'red', text: isRunning ? '已启用' : '已停用' },
      {
        key: 'illegalRunning',
        color: illegalRunning ? 'blue' : 'gray',
        text: illegalRunning ? '违规检测启用' : '违规检测关闭',
      },
      {
        key: 'illegalCheck',
        color: illegalRunning && illegalCheck ? 'green' : 'gray',
        text: illegalCheck ? '违规核查启用' : '违规核查关闭',
      },
      {
        key: 'unRegisteredRunning',
        color: unRegisteredRunning ? 'blue' : 'gray',
        text: unRegisteredRunning ? '未登记检测启用' : '未登记检测关闭',
      },
      {
        key: 'unRegisteredCheck',
        color: unRegisteredRunning && unRegisteredCheck ? 'green' : 'gray',
        text: unRegisteredCheck ? '未登记核查启用' : '未登记核查关闭',
      },
    ];
    return tags
      .filter(tag => {
        if (tag.key === 'isRunning' || tag.key === 'isMonitoring') return true;
        if (tag.key !== 'isRunning' && tag.key !== 'isMonitoring') return isRunning;
      }) // 只显示启用的标签
      .filter(tag => {
        if (tag.key === 'illegalCheck') return illegalRunning;
        if (tag.key === 'unRegisteredCheck') return unRegisteredRunning;
        return true; // 其他标签都显示
      })
      .map(tag => (
        <Tag key={tag.key} color={tag.color}>
          {tag.text}
        </Tag>
      ));
  };

  // 显示抽屉
  const showDrawer = () => {
    form.setFieldsValue({
      isRunning,
      illegalCheck,
      illegalRunning,
      unRegisteredCheck,
      unRegisteredRunning,
      speedLimit,
    });
    setDrawerVisible(true);
  };

  // 关闭抽屉
  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

  // 保存规则
  const handleSaveRules = async () => {
    const rules = await form.validateFields();
    await ctrl.updateMonitoringEquipmentRules({ id: meData.id, rules });
    await ctrl.getMonitoringEquipment();
    onCloseDrawer();
  };

  // 删除设备
  const handleDeleteEquipment = async () => {
    try {
      const confirm = await Modal.confirm({
        title: '确认删除',
        content: `确定要删除设备 "${name}" 吗？`,
        okText: '删除',
        cancelText: '取消',
        okType: 'danger',
        onOk: async () => {
          // await ctrl.deleteMonitoringEquipment({ id });
          message.success('设备已删除');
          await ctrl.getMonitoringEquipment();
        },
      });
    } catch (error) {
      console.error('删除设备失败:', error);
    }
  };

  // 切换实时监控状态
  const toggleMonitoring = async () => {
    try {
    } catch (error) {
      console.error('切换监控状态失败:', error);
    }
  };

  return (
    <div style={{ margin: '10px' }}>
      <Card
        size="small"
        hoverable={true}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{name}</span>
            <Space>
              <Button type="primary" icon={<SettingOutlined />} size="small" onClick={showDrawer}>
                配置规则
              </Button>
              <Button type="primary" icon={<DeleteOutlined />} danger size="small" onClick={handleDeleteEquipment}>
                删除
              </Button>
              <Button
                type="primary"
                icon={<VideoCameraOutlined />}
                size="small"
                style={{ color: '#52c41a' }}
                onClick={toggleMonitoring}
              >
                实时监控
              </Button>
            </Space>
          </div>
        }
        extra={id}
        style={{ width: '100%' }}
        headStyle={{ backgroundColor: '#f8f9fa' }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Badge status={isRunning ? 'success' : 'error'} text={`设备ID: ${id}`} />
          </Col>
          <Col span={12}>
            <Badge status="default" text={`IP: ${ip}`} />
          </Col>
          <Col span={12}>
            <Badge status="default" text={`位置: ${location}`} />
          </Col>
          <Col span={12}>
            <Badge status="default" text={`设备类型: ${type}`} />
          </Col>
          <Col span={12}>
            <Badge status="default" text={`S/N号: ${sn}`} />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={24}>
            <h3 style={{ margin: '8px 0' }}>规则设置</h3>
            <Row gutter={[8, 8]}>{renderStatusTags()}</Row>
          </Col>
        </Row>
      </Card>

      <Drawer
        title="规则配置"
        placement="right"
        width={400}
        onClose={onCloseDrawer}
        open={drawerVisible}
        extra={
          <Space>
            <Button onClick={onCloseDrawer}>取消</Button>
            <Button type="primary" onClick={handleSaveRules}>
              保存
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item label="是否启用设备" name="isRunning" valuePropName="checked" dependencies={['isRunning']}>
            <Switch />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prevValues, currValues) => prevValues.isRunning !== currValues.isRunning}>
            {({ getFieldValue }) => {
              return getFieldValue('isRunning') ? (
                <>
                  <Form.Item label="违规检测启用" name="illegalRunning" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currValues) => prevValues.illegalRunning !== currValues.illegalRunning}
                  >
                    {({ getFieldValue }) => {
                      return getFieldValue('illegalRunning') ? (
                        <>
                          <Form.Item
                            label="车速限制"
                            name="speedLimit"
                            rules={[{ required: true, message: '请输入车速限制' }]}
                          >
                            <Input
                              type="number"
                              placeholder="请输入车速限制（单位：km/h）"
                              suffix="km/h"
                              size="small"
                              style={{ width: '200px', marginLeft: '20px' }}
                            />
                          </Form.Item>
                          <Form.Item label="违规核查启用" name="illegalCheck" valuePropName="checked">
                            <Switch />
                          </Form.Item>
                        </>
                      ) : null;
                    }}
                  </Form.Item>

                  <Form.Item label="未登记检测启用" name="unRegisteredRunning" valuePropName="checked">
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currValues) =>
                      prevValues.unRegisteredRunning !== currValues.unRegisteredRunning
                    }
                  >
                    {({ getFieldValue }) => {
                      return getFieldValue('unRegisteredRunning') ? (
                        <Form.Item label="未登记核查启用" name="unRegisteredCheck" valuePropName="checked">
                          <Switch />
                        </Form.Item>
                      ) : null;
                    }}
                  </Form.Item>
                </>
              ) : null;
            }}
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
