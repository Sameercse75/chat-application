import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routers/userRouter.js";
import messageRouter from "./routers/messageRouter.js";
import { Server } from "socket.io";

// create express and http server
const app = express();
const server = http.createServer(app);

// initialize socket.io server
export const io = new Server(server, {
  cors: { origin: "*" },
});

// store online users
export const userSocketMap = {}; // {userId: socketId}

// socket io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// routes setup
app.use("/api/status", (req, res) => {
  res.send("server is live");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

//connect to DB
await connectDB();

if (process.env.NODE_ENV !== "Production") {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
}

//export server to vercel
export default server;