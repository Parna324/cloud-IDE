import { useState } from "react";

import axios from "axios";

import Sidebar from "./Sidebar";

import Topbar from "./Topbar";

import EditorPanel from "./EditorPanel";

import Terminal from "./Terminal";

function IDELayout() {
  const [language, setLanguage] = useState("python");

  const [code, setCode] = useState("print('Hello World')");

  const [output, setOutput] = useState("");

  const [saving, setSaving] = useState(false);

  const [saveNote, setSaveNote] = useState("");

  const projectId = localStorage.getItem("projectId");

  const token = localStorage.getItem("token");

  const fileNameByLanguage = {
    python: "main.py",
    javascript: "main.js",
    cpp: "main.cpp",
    java: "Main.java",
  };

  const apiBase =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";
  const executionUrl =
    import.meta.env.VITE_EXECUTION_URL ?? `${apiBase}/code/execute`;
  const authSaveUrl =
    import.meta.env.VITE_AUTH_SAVE_URL ?? `${apiBase}/auth/files/save`;

  const runCode = async () => {
    try {
      setOutput("Running...");

      const response = await axios.post(executionUrl, {
        language,
        code,
      });

      setOutput(response.data.output);
    } catch (error) {
      setOutput(error.response?.data?.error || error.message);
    }
  };

  const saveFile = async () => {
    if (!projectId) {
      setSaveNote("Select a project from the dashboard first.");
      return;
    }

    if (!token) {
      setSaveNote("Please log in to save files.");
      return;
    }

    try {
      setSaving(true);
      setSaveNote("Saving...");

      await axios.post(
        authSaveUrl,
        {
          name: fileNameByLanguage[language] || "main.txt",
          language,
          content: code,
          projectId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSaveNote("Saved");
    } catch (error) {
      setSaveNote(error.response?.data?.error || "Failed to save file.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen bg-[#020617] flex flex-col">
      <Topbar
        language={language}
        setLanguage={setLanguage}
        runCode={runCode}
        saveFile={saveFile}
        saving={saving}
        saveNote={saveNote}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <EditorPanel language={language} code={code} setCode={setCode} />
      </div>

      <Terminal output={output} />
    </div>
  );
}

export default IDELayout;
