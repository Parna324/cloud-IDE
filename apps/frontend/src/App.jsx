import { useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";

function App() {
  const [code, setCode] = useState("print('Hello World')");
  const [output, setOutput] = useState("");

  const runCode = async () => {
    try {
      const response = await axios.post("http://localhost:5002/execute", {
        code,
      });

      setOutput(response.data.output || response.data.error);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1>Cloud IDE</h1>

      <Editor
        height="400px"
        defaultLanguage="python"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
      />

      <button
        onClick={runCode}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Run Code
      </button>

      <pre
        style={{
          marginTop: "20px",
          background: "#111827",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        {output}
      </pre>
    </div>
  );
}

export default App;
