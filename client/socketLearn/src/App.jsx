import React, { useMemo, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react';

function App() {
  const [id, setId] = useState("no");
  const [otherId, setOtherId] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("javascript");

  // Establish a socket connection
  const socket = useMemo(() => io("http://localhost:3000"), []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setId(socket.id);
    });

    // Listen for content and language changes from other users
    socket.on("editorContentUpdate", (newContent) => {
      setContent(newContent);
    });

    socket.on("languageChange", (newLanguage) => {
      setLanguage(newLanguage);
    });

    // Clean up socket on unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  // Handle editor content changes and broadcast to other users
  const handleEditorChange = (value) => {
    setContent(value || "");
    socket.emit("editorContentUpdate", value || "");
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("languageChange", newLanguage);
  };

  // Set up custom snippets for commonly used patterns
  const editorDidMount = (editor, monaco) => {
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: () => ({
        suggestions: [
          {
            label: 'console.log',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'console.log(${1:object});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Log output to console',
          },
          {
            label: 'function',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'function ${1:functionName}(${2:params}) {\n\t${3:// body}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Function declaration',
          },
          {
            label: 'if',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'if (${1:condition}) {\n\t${2:// body}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'If statement',
          },
          {
            label: 'for loop',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3:// body}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'For loop',
          },
          {
            label: 'async function',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'async function ${1:functionName}(${2:params}) {\n\t${3:// body}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Async function declaration',
          },
        ],
      }),
    });
  };

  return (
    <>
      <h1>My id = {id}</h1>
      <input
        type="text"
        onChange={(e) => setOtherId(e.target.value)}
        value={otherId}
        placeholder="Friend's ID"
      />
      <Editor
        height="300px"
        width="100%"
        language={language}
        theme="vs-dark"
        value={content}
        onChange={handleEditorChange}
        onMount={editorDidMount}
      />
      <select
        onChange={handleLanguageChange}
        value={language}
        style={{ margin: "10px 0" }}
      >
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
      </select>
    </>
  );
}

export default App;
