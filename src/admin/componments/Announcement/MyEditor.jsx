import React, { lazy, useState, useEffect, Suspense } from 'react';
import { Style } from 'react-imvc/component';
const Editor = lazy(() => import('@wangeditor/editor-for-react').then(module => ({ default: module.Editor })));
const Toolbar = lazy(() => import('@wangeditor/editor-for-react').then(module => ({ default: module.Toolbar })));

function MyEditor() {
  // editor 实例
  const [editor, setEditor] = useState(null);

  // 编辑器内容
  const [html, setHtml] = useState('<p>hello</p>');

  // 模拟 ajax 请求，异步设置 html
  useEffect(() => {
    setTimeout(() => {
      setHtml('<p>hello world</p>');
    }, 1500);
  }, []);

  // 工具栏配置
  const toolbarConfig = {}; // JS 语法

  // 编辑器配置
  const editorConfig = {
    // JS 语法
    placeholder: '请输入内容...',
  };

  // 及时销毁 editor ，重要！
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
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
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

      <div style={{ marginTop: '15px' }} dangerouslySetInnerHTML={{ __html: html }}></div>
    </Suspense>
  );
}

export default MyEditor;
