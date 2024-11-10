import React, { useMemo, useState } from 'react'
import { useEffect } from 'react'
import { io } from 'socket.io-client'

function App() {
  const [id, setId] = useState("no");
  const [otherId, setOtherId] = useState("");
  const [message, setMessage] = useState("");
  
  const socket = useMemo(() => io("http://localhost:3000"), []);

  useEffect(() => {

    socket.on("connect", () => {
      console.log("connected", socket.id);
      setId(socket.id)
    })

    socket.on("welcome", (x) => {
      console.log("welcome ", x);
    })

    socket.on("pvt", (x) => {
      console.log("chat: ", x);
    })

  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(e.target.value)
    socket.emit("privateMessage", {otherId,message})
  }

  return (
    <>
      <h1>My id = {id}</h1>
      <input type="text" name="" onChange={(e) => { setOtherId(e.target.value) }} value={otherId} placeholder="friend's id" id="" />
      <input type="text" name="" onChange={handleSubmit} value={message} placeholder="friend's id" id="" />
      <input type="button" value="submit" onClick={handleSubmit} />
    </>
  )
}

export default App
