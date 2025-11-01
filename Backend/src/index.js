import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import { app } from "./app.js";
import { Server } from "socket.io";

dotenv.config();

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    console.log("Database connected");

    // Start Express server
    const server = app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });

    // Initialize Socket.io
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: "*", // Replace with your frontend URL in production
      },
    });

    io.on("connection", (socket) => {
      console.log("Socket connected: " + socket.id);

      /*** ==== CHAT SOCKET ==== ***/
      socket.on("setup", (userData) => {
        console.log("Setup socket for user:", userData.username);
        socket.join(userData._id);
        socket.emit("connected");
      });

      socket.on("join chat", (room) => {
        console.log("Joining chat room:", room);
        socket.join(room);
      });

      socket.on("new message", (newMessage) => {
        const chat = newMessage.chatId;
        if (!chat.users) return console.log("Chat.users not defined");

        chat.users.forEach((user) => {
          if (user._id === newMessage.sender._id) return;
          io.to(user._id).emit("message received", newMessage);
        });
      });

      socket.off("setup", () => {
        console.log("User disconnected from chat");
        socket.leave(userData._id);
      });

      /*** ==== VIDEO CONFERENCE SOCKET ==== ***/
      socket.on("join-room", ({ roomId, userId }) => {
        console.log(`User ${userId} joined room ${roomId}`);
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", userId);

        socket.on("disconnect", () => {
          socket.to(roomId).emit("user-disconnected", userId);
          console.log(`User ${userId} disconnected from room ${roomId}`);
        });
      });
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
