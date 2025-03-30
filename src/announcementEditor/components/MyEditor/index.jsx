import React, { lazy, useState, useEffect, Suspense, useRef } from 'react';
import { Style } from 'react-imvc/component';
import { useCtrl, useModelState, useModelActions } from 'react-imvc/hook';
import DT from '../../../share/debounce&throttle';
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
        onBeforeUpload(file) {
          console.log(file, '@@@');
          return file;
        },

        // 上传进度的回调函数
        onProgress(progress) {
          console.log('progress', progress);
        },

        onSuccess(file, res) {
          console.log(`${file.name} 上传成功`, res);
        },

        onFailed(file, res) {
          console.log(`${file.name} 上传失败`, res);
        },

        // 上传错误，或者触发 timeout 超时
        onError(file, err, res) {
          console.log(`${file.name} 上传出错`, err, res);
        },
        customInsert(res, insertFn) {
          // res 即服务端的返回结果

          // 从 res 中找到 url alt href ，然后插入图片
          insertFn(url, alt, href);
        },
        base64LimitSize: 5 * 1024,
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

  const updateCallBack = DT.debounce((id, content) => {
    ctrl.updateAnnouncementContentById(id, content);
  });

  return (
    <>
      <Style name="editor" />
      <div>
        <div style={{ border: '1px solid #ccc', width: 846, height: 50 }}>标题</div>
        <div style={{ border: '1px solid #ccc', width: 846, zIndex: 1000 }}>
          <Toolbar
            editor={editor}
            defaultConfig={toolbarConfig}
            mode="default"
            style={{ borderBottom: '1px solid #ccc' }}
          />
          <Editor
            defaultConfig={editorConfig}
            value={announcementInfo?.content}
            onCreated={setEditor}
            onChange={editor => {
              updateCallBack(state.announcementId, editor.getHtml());
              actions.UPDATE_ANNOUNCEMENTCONTENT(editor.getHtml());
            }}
            mode="default"
            style={{ height: '600px', overflowY: 'hidden' }}
          />
        </div>
      </div>
    </>
  );
}
