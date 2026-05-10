import { Server } from "socket.io";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

let io;
const userSocketMap = {};

export function setupSocket(server) {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'https://echo-space-xtbt.vercel.app'],
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    console.log("A user connected", socket.user?.fullName || userId);

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.user?.fullName || userId);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket server has not been initialized.");
  }

  return io;
}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId?.toString?.() ?? userId];
}