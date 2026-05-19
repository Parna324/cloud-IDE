import Editor from "@monaco-editor/react";

function EditorPanel({ language, code, setCode }) {
  return (
    <div className="flex-1 h-full">
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
      />
    </div>
  );
}

export default EditorPanel;
