import React, { lazy, useState, useEffect } from 'react';
import { Style } from 'react-imvc/component';
import { useCtrl, useModelState, useModelActions } from 'react-imvc/hook';
import { debounce } from 'lodash';
import { Input } from 'antd';
import AttachedFile from './AttachedFile';
const { TextArea } = Input;
const Editor = lazy(() => import('@wangeditor/editor-for-react').then(module => ({ default: module.Editor })));
const Toolbar = lazy(() => import('@wangeditor/editor-for-react').then(module => ({ default: module.Toolbar })));

export default function MyEditor({ announcementInfo }) {
  const ctrl = useCtrl();
  const state = useModelState();
  const actions = useModelActions();
  const [editor, setEditor] = useState(null);
  const toolbarConfig = {};
  const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        customUpload: async (file, insertFn) => {
          const xhr = new XMLHttpRequest();
          xhr.withCredentials = true;
          xhr.open('POST', 'http://localhost:3000/uploadFile', true);
          xhr.setRequestHeader('suffix', file.name.split('.').pop());
          xhr.onload = () => {
            const result = JSON.parse(xhr.responseText);
            insertFn(result.url);
          };
          xhr.upload.onprogress = e => {};
          xhr.send(file);
        },
      },
      uploadVideo: {
        customUpload: async (file, insertFn) => {
          const xhr = new XMLHttpRequest();
          xhr.withCredentials = true;
          xhr.open('POST', 'http://localhost:3000/uploadFile', true);
          xhr.setRequestHeader('suffix', file.name.split('.').pop());
          xhr.onload = () => {
            const result = JSON.parse(xhr.responseText);
            insertFn(result.url);
          };
          xhr.upload.onprogress = e => {};
          xhr.send(file);
        },
      },
    },
  };

  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  const updateContent = debounce((id, content) => {
    ctrl.updateAnnouncementContentById(id, content);
  }, 3000);

  return (
    <>
      <Style name="editor" />
      <div>
        <div className="announcement-title-container">
          <TextArea
            className="announcement-title"
            value={state.announcementInfo?.title}
            placeholder="标题"
            onChange={e => {
              const title = e.target.value;
              actions.UPDATE_ANNOUNCEMENTTITLE(title);
              document.title = `编辑公告: ${title}`;
            }}
            onBlur={e => ctrl.updateAnnouncementTitleById(state.announcementId, e.target.value)}
          />
        </div>
        <div className="announcement-content-container">
          <Toolbar className="toolbar" editor={editor} defaultConfig={toolbarConfig} mode="default" />
          <Editor
            className="editor"
            defaultConfig={editorConfig}
            value={announcementInfo?.content}
            onCreated={setEditor}
            onChange={editor => {
              updateContent(state.announcementId, editor.getHtml());
              actions.UPDATE_ANNOUNCEMENTCONTENT(editor.getHtml());
            }}
            mode="default"
          />
        </div>
      </div>
      <AttachedFile />
    </>
  );
}
