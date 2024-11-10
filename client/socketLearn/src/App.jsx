import React, { useMemo, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react';

function App() {
  const [id, setId] = useState("no");
  const [otherId, setOtherId] = useState("");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("javascript");

  // Establish a socket connection
  const socket = useMemo(() => io("http://localhost:3000"), []);

  useEffect(() => {
    // Connect to the socket and set the ID
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setId(socket.id);
    });

    // Receive welcome message from server
    socket.on("welcome", (x) => {
      console.log("welcome ", x);
    });

    // Listen for incoming private messages
    socket.on("pvt", (x) => {
      console.log("chat: ", x);
    });

    // Listen for content updates from other users
    socket.on("editorContentUpdate", (newContent) => {
      setMessage(newContent);
    });
  }, [socket]);

  // Handle content changes and broadcast to other users
  const handleEditorChange = (value) => {
    setMessage(value || "");
    // Emit the updated content to other connected clients
    socket.emit("editorContentUpdate", value || "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("privateMessage", { otherId, message });
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
        value={message}
        onChange={handleEditorChange}
      />
      <select
        onChange={(e) => setLanguage(e.target.value)}
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
      <button onClick={handleSubmit}>Send Message</button>
    </>
  );
}

export default App;
