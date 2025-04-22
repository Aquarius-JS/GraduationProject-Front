import React from 'react';
import { useModelState } from 'react-imvc/hook';

export default () => {
  const state = useModelState('violationInfoList');

  return (
    <>
      <div>违规信息列表</div>
    </>
  );
};
