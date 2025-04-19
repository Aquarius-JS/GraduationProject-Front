import React, { useEffect, useState } from 'react';
import { useCtrl, useModelState } from 'react-imvc/hook';
import { Form, Input, Button, Upload, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getURLParameter, updateURLParameter } from '../../../share/url';

export default function ReportForm() {
  const ctrl = useCtrl();
  const state = useModelState();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    form.setFieldsValue({
      licenseNumber: state.urlParams.license_number,
    });
  }, []);

  const handleSubmit = async values => {
    const res = await ctrl.violationInfoReporting({
      ...values,
      reportingSource: 1,
      imgList: fileList,
      status: 1, // 人工上报默认不需要审核
    });
    if (res.isOk) {
      message.success(res.message);
      form.resetFields();
      setFileList([]);
      updateURLParameter('license_number', '');
      const params = await getURLParameter();
      actions.UPDATE_URLPARAMS(params);
    } else {
      message.warning(res.message);
    }
  };

  const customRequest = async options => {
    const { file, action: url } = options;
    if (file.type.indexOf('image') === -1) {
      message.warning('请选择图片');
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', url, true);
    xhr.setRequestHeader('suffix', file.name.split('.').pop());
    xhr.onload = () => {
      const result = JSON.parse(xhr.responseText);
      setFileList([...fileList, { id: result.fileName, url: result.url }]);
      options.onSuccess();
    };
    xhr.send(file);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto 50px' }}>
      <h2 style={{ marginBottom: '20px' }}>违规信息上报</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ maxWidth: '100%' }}>
        <Form.Item
          name="imgList"
          label="图片上传"
          getValueFromEvent={e => e.fileList}
          rules={[{ required: true, message: '请上传至少一张图片！' }]}
        >
          <Upload
            fileList={fileList}
            onRemove={e => {
              setFileList(fileList.filter(file => file.id !== e.id));
            }}
            accept="image/*"
            listType="picture-card"
            multiple={false}
            showUploadList={{ showRemoveIcon: true }}
            customRequest={customRequest}
            action="http://localhost:3000/uploadFile"
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item
          name="licenseNumber"
          label="车牌号"
          rules={[
            { required: true, message: '请输入车牌号！' },
            {
              pattern: /^[^IO]*$/,
              message: '车牌号不能包含I和O！',
              warningOnly: true,
            },
          ]}
          onChange={e => {
            form.setFieldsValue({ licenseNumber: e.target.value.toUpperCase() });
          }}
        >
          <Input placeholder="请输入车牌号" />
        </Form.Item>
        <Form.Item name="detectionLocation" label="检测地点" rules={[{ required: true, message: '请输入检测地点！' }]}>
          <Input placeholder="请输入检测地点" />
        </Form.Item>
        <Form.Item
          name="violationTitle"
          label="违规类型标题"
          rules={[{ required: true, message: '请选择或输入违规类型！' }]}
        >
          <Select
            placeholder="请选择或输入违规类型"
            allowClear
            mode="tags" // 使用 tags 模式允许输入
            tokenSeparators={[',']} // 定义分隔符（这里使用逗号，但用户也可以直接输入）
            onChange={value => {
              // 处理选择或输入的值
              console.log('选择或输入的值:', value);
            }}
          >
            <Select.Option value="超速">超速</Select.Option>
            <Select.Option value="超载">超载</Select.Option>
            <Select.Option value="违停">违停</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="violationContent" label="违规内容" rules={[{ required: true, message: '请描述违规内容！' }]}>
          <Input.TextArea placeholder="请详细描述违规内容..." rows={4} showCount maxLength={200} />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
