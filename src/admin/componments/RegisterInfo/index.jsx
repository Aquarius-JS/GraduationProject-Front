import React from 'react';
import { useCtrl, useModelState } from 'react-imvc/hook';

export default function () {
  const ctrl = useCtrl();
  const state = useModelState();
  // ctrl.getRegisterInfo();

  return (
    <>
      {state.registerInfo?.map(item => (
        <div>{item.stu_number}</div>
      ))}
    </>
  );
}
