import React, { Suspense } from 'react';
import { Style } from 'react-imvc/component';
import { useModelState } from 'react-imvc/hook';
import MyEditor from './components/MyEditor';

export default function () {
  const state = useModelState();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Style name="announcement" />
      <div className="announcement-container">
        <MyEditor announcementInfo={state.announcementInfo} />
      </div>
    </Suspense>
  );
}
