import React, { useEffect, useState } from 'react';
import { useCtrl, useModelActions, useModelState } from 'react-imvc/hook';
import { Button, Modal, Image } from 'antd';

export default function () {
  const ctrl = useCtrl();
  const state = useModelState();
  const actions = useModelActions();
  const { violationInfoModalData, violationInfoList } = state;
  const [selectedVioInfo, setSelectedVioInfo] = useState({});
  useEffect(() => {
    if (!violationInfoModalData.isModalOpen) {
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
      >
        <p>{selectedVioInfo.id}</p>
        <p>{selectedVioInfo.license_number}</p>
        <p>
          {selectedVioInfo.violation_title?.map(item => (
            <span key={item}>{item}</span>
          ))}
        </p>
        <p>{selectedVioInfo.violation_content}</p>
        <p>{selectedVioInfo.detection_location}</p>
        <p>
          {selectedVioInfo.img_list?.map(item => (
            <Image key={item.id} src={item.url} />
          ))}
        </p>
        <p>{selectedVioInfo.reporting_time}</p>
        <p>{selectedVioInfo.reporting_source}</p>
        <p>{selectedVioInfo.have_precessed}</p>
      </Modal>
    </>
  );
}
