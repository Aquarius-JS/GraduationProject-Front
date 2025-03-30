import React, { lazy, useState, useEffect, Suspense } from 'react';
import { Style } from 'react-imvc/component';
const Editor = lazy(() => import('@wangeditor/editor-for-react').then(module => ({ default: module.Editor })));
const Toolbar = lazy(() => import('@wangeditor/editor-for-react').then(module => ({ default: module.Toolbar })));

function MyEditor() {
  const [editor, setEditor] = useState(null);

  // 编辑器内容
  const [html, setHtml] = useState();

  // 工具栏配置
  const toolbarConfig = {};

  // 编辑器配置
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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Style name="editor" />
      <div>
        <div style={{ border: '1px solid #ccc', width: 800, height: 600, zIndex: 1000 }}>
          <Toolbar
            editor={editor}
            defaultConfig={toolbarConfig}
            mode="default"
            style={{ borderBottom: '1px solid #ccc' }}
          />
          <Editor
            defaultConfig={editorConfig}
            value={html}
            onCreated={setEditor}
            onChange={editor => setHtml(editor.getHtml())}
            mode="default"
            style={{ height: '500px', overflowY: 'hidden' }}
          />
        </div>
        <hr />
        预览效果:
        <div
          style={{
            marginTop: '15px',
            border: '1px solid #ccc',
            width: 800,
            height: 600,
            zIndex: 1000,
            wordWrap: 'break-word',
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      </div>
    </Suspense>
  );
}

export default MyEditor;
