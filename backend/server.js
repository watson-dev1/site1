const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const botRoutes = require("./routes/botRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());

// 🔗 MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/wa-saas-pro");

// 🌐 Frontend
app.use(express.static("../frontend"));

// 🔐 Routes
app.use("/api/auth", authRoutes);
app.use("/api/bot", botRoutes(io));

io.on("connection", (socket) => {
    console.log("👤 Client connected to SaaS dashboard");
});

server.listen(3000, () => {
    console.log("🚀 SaaS Platform running on port 3000");
});
