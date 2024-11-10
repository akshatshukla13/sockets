import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected");
  console.log("id", socket.id);
  socket.emit("welcome", `new Welcome to server, ${socket.id}`);
  socket.broadcast.emit("welcome", socket.id, " joined the server");

  socket.on("privateMessage", ({ otherId, message }) => {
    console.log(otherId);
    console.log(message);
    socket.to(otherId).emit("pvt", message);
  });
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello akshat");
});

server.listen(port, () => {
  console.log("server is running on port ", port);
});
