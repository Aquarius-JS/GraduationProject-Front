import React, { useEffect, useState } from 'react';
import { useCtrl, useModelActions, useModelState } from 'react-imvc/hook';
import { Button, Modal, Image, Descriptions, Tag, Input, Space, message } from 'antd';
import formatUnix from '../../../share/formatUnix';

export default function () {
  const ctrl = useCtrl();
  const state = useModelState();
  const actions = useModelActions();
  const { violationInfoModalData, violationInfoList } = state;
  const [selectedVioInfo, setSelectedVioInfo] = useState({});
  const [isAppealing, setIsAppealing] = useState(false);
  const [appealReason, setAppealReason] = useState('');

  useEffect(() => {
    if (!violationInfoModalData.isModalOpen) {
      setIsAppealing(false);
      setAppealReason('');
      return;
    }
    const selectedVioInfo = violationInfoList.find(item => item.id === violationInfoModalData?.violationInfoId);
    setSelectedVioInfo(selectedVioInfo);

    if (selectedVioInfo.have_read === 0) {
      ctrl.violationInfoHaveRead(violationInfoModalData.violationInfoId);
      const newVioInfoList = violationInfoList.filter(item => item.id !== violationInfoModalData.violationInfoId);
      actions.UPDATE_VIOLATIONINFOLIST([...newVioInfoList, { ...selectedVioInfo, have_read: 1 }]);
    }
  }, [violationInfoModalData]);

  const handleAppeal = async (id, appealReason) => {
    const res = await ctrl.violationInfoAppeal(id, appealReason);
    if (res.isOk) {
      message.success(res.message);
    } else {
      message.warning(res.message);
    }
  };

  return (
    <>
      <Modal
        title="违规信息详情"
        open={violationInfoModalData.isModalOpen}
        onCancel={() => actions.UPDATE_VIOLATIONINFOMODALDATA({ isModalOpen: false, violationInfoId: '' })}
        footer={[
          <Button
            key="close"
            onClick={() => actions.UPDATE_VIOLATIONINFOMODALDATA({ isModalOpen: false, violationInfoId: '' })}
          >
            关闭
          </Button>,
        ]}
        width={1300}
      >
        <Descriptions bordered column={3}>
          <Descriptions.Item label="车牌号" span={1}>
            {selectedVioInfo.license_number}
          </Descriptions.Item>
          <Descriptions.Item label="违规类型" span={1}>
            {selectedVioInfo.violation_title?.map(item => (
              <Tag
                bordered={false}
                color={item === '超载' ? 'red' : item === '超速' ? 'error' : item === '违停' ? 'volcano' : 'warning'}
                key={item}
              >
                {item}
              </Tag>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="违规时间" span={1}>
            {formatUnix(selectedVioInfo.reporting_time)}
          </Descriptions.Item>
          <Descriptions.Item label="信息来源" span={1}>
            <Tag
              bordered={false}
              color={
                selectedVioInfo.reporting_source === 0
                  ? 'cyan'
                  : selectedVioInfo.reporting_source === 1
                  ? 'blue'
                  : 'lime'
              }
            >
              {selectedVioInfo.reporting_source === 0
                ? '机器'
                : selectedVioInfo.reporting_source === 1
                ? '人工'
                : '其他'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="违规地点" span={1}>
            {selectedVioInfo.detection_location}
          </Descriptions.Item>
          <Descriptions.Item label="状态" span={1}>
            <Tag
              bordered={false}
              color={
                selectedVioInfo.status === 1
                  ? 'warning'
                  : selectedVioInfo.status === 3
                  ? 'blue'
                  : selectedVioInfo.status === 4
                  ? 'green'
                  : selectedVioInfo.status === 5
                  ? 'red'
                  : selectedVioInfo.status === 6
                  ? 'green'
                  : 'gray'
              }
            >
              {selectedVioInfo.status === 1
                ? '待核销'
                : selectedVioInfo.status === 3
                ? '申诉中'
                : selectedVioInfo.status === 4
                ? '申诉通过'
                : selectedVioInfo.status === 5
                ? '申诉未通过'
                : selectedVioInfo.status === 6
                ? '已核销'
                : '其他'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="违规说明" span={3}>
            {selectedVioInfo.violation_content}
          </Descriptions.Item>
          <Descriptions.Item label="图片列表" span={3}>
            {selectedVioInfo.img_list?.map((img, index) => (
              <Image key={index} src={img.url} alt={`违规图片${index + 1}`} style={{ marginRight: 10 }} width={100} />
            ))}
          </Descriptions.Item>
          {selectedVioInfo.remark && (
            <Descriptions.Item label="备注" span={3}>
              {selectedVioInfo.remark}
            </Descriptions.Item>
          )}
        </Descriptions>
        {selectedVioInfo && selectedVioInfo.status === 1 && (
          <div style={{ marginTop: 20 }}>
            {!isAppealing && (
              <Button
                type="primary"
                onClick={() => {
                  setIsAppealing(true);
                }}
              >
                申诉
              </Button>
            )}
            {isAppealing && (
              <div>
                <div style={{ marginBottom: 15 }}>
                  <Input.TextArea
                    value={appealReason}
                    onChange={e => setAppealReason(e.target.value)}
                    placeholder="请输入申诉理由"
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Space size="middle">
                    <Button color="cyan" variant="solid" onClick={() => handleAppeal(selectedVioInfo.id, appealReason)}>
                      确认申诉
                    </Button>
                    <Button
                      type="primary"
                      danger
                      onClick={() => {
                        setIsAppealing(false);
                        setAppealReason('');
                      }}
                    >
                      取消申诉
                    </Button>
                  </Space>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
