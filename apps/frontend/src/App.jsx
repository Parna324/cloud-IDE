import { useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  const [code, setCode] = useState("print('Hello World')");

  const [language, setLanguage] = useState("python");

  const [output, setOutput] = useState("");

  const [loading, setLoading] = useState(false);

  const apiBase =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";
  const executionUrl =
    import.meta.env.VITE_EXECUTION_URL ?? `${apiBase}/code/execute`;

  const runCode = async () => {
    try {
      setLoading(true);

      setOutput("Running...");

      const response = await axios.post(executionUrl, {
        code,
        language,
      });

      setOutput(response.data.output);
    } catch (error) {
      setOutput(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Navbar />

      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 72px)",
        }}
      >
        <Sidebar />

        <main
          style={{
            flex: 1,
            padding: "20px",
          }}
        >
          <h1>Cloud IDE Platform</h1>

          <div
            style={{
              marginBottom: "10px",
            }}
          >
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                padding: "10px",
                marginRight: "10px",
              }}
            >
              <option value="python">Python</option>

              <option value="javascript">JavaScript</option>

              <option value="cpp">C++</option>

              <option value="java">Java</option>
            </select>

            <button
              onClick={runCode}
              disabled={loading}
              style={{
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              {loading ? "Running..." : "Run"}
            </button>
          </div>

          <Editor
            height="500px"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value)}
          />

          <div
            style={{
              marginTop: "20px",
              background: "#111827",
              padding: "20px",
              minHeight: "150px",
              borderRadius: "10px",
            }}
          >
            <h2>Output</h2>

            <pre>{output}</pre>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
