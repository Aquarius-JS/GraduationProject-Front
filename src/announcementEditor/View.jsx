import React, { Suspense } from 'react';
import { Style } from 'react-imvc/component';
import { useModelState } from 'react-imvc/hook';

export default function () {
  const state = useModelState();
  console.log(state.announcementInfo);
  return (
    <>
      <Style name="announcement" />
      <div className="announcement-container">
        <div className="announcement-info" dangerouslySetInnerHTML={{ __html: state.announcementInfo?.content }} />
      </div>
    </>
  );
}
