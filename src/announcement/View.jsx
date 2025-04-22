import React from 'react';
import { Style } from 'react-imvc/component';
import { useModelState } from 'react-imvc/hook';
import { formatUnixToYMD } from '../share/formatUnix';

export default function () {
  const state = useModelState();
  return (
    <>
      <Style name="announcement" />
      <div className="announcement-container">
        <div className="announcement-info" dangerouslySetInnerHTML={{ __html: state.announcementInfo?.content }} />
        {state.announcementInfo?.attached_file_list_info?.length > 0 && (
          <div className="attached-file">
            <p style={{ color: 'gray' }}>附件:</p>
            {state.announcementInfo.attached_file_list_info.map(item => {
              return (
                <div style={{ margin: '5px 10px' }}>
                  <a href={item.url} target="_blank">
                    {item.name}
                  </a>
                </div>
              );
            })}
          </div>
        )}
        <div className="announcement-updated_at">
          <p>更新时间:</p>
          <p>{formatUnixToYMD(state.announcementInfo?.updated_at)}</p>
        </div>
      </div>
    </>
  );
}
