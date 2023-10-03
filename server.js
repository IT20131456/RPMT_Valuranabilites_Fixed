// Import required modules
const https = require('https'); // Import the HTTPS module for creating a secure server
const fs = require('fs'); // Import the File System module for reading SSL/TLS certificates
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
const { Server } = require("socket.io"); // Import the Socket.io server module
require("dotenv").config();

const app = express(); // Create an Express.js application

// Middleware to handle JSON data and CORS
app.use(bodyparser.json());
app.use(cors());

// MongoDB connection URI
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }); // Connect to MongoDB

mongoose.connection.once("open", () => {
  console.log("MongoDB connected"); // Log a message when MongoDB connection is established
});

// Import routes for the application
const sgrouter = require("./routes/studentGroupRoute");
const sdrouter = require("./routes/supervisorDetailsRoute");
const rerouter = require("./routes/requestRoute");
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/users');
const topicRoutes = require('./routes/topic');
const evrouter = require("./routes/evaluation");
const subTypeRoute = require('./routes/submitionType');
const marks = require('./routes/marks');
const submitions = require('./routes/submition');
const subnotify = require('./routes/submitionNotification');
const adminDcoumentTempRoutes = require('./routes/adminDocumentTemp');
const chatGroupRoutes = require('./routes/chatMsg');
const markingSchemRoutes = require('./routes/markingSchem');
const downloadFileRoutes = require('./routes/downloadFile');
const supportMsgRoutes = require('./routes/supportMsg');
const noticeRoutes = require('./routes/notice');

// Use the imported routes in the application
app.use(sgrouter);
app.use(sdrouter);
app.use(rerouter);
app.use(adminRouter);
app.use(userRouter);
app.use(topicRoutes);
app.use(subTypeRoute);
app.use(evrouter);
app.use(marks);
app.use(submitions);
app.use(subnotify);
app.use(adminDcoumentTempRoutes);
app.use(chatGroupRoutes);
app.use(markingSchemRoutes);
app.use(downloadFileRoutes);
app.use(supportMsgRoutes);
app.use(noticeRoutes);

const options = {
  key: fs.readFileSync('path/to/private-key.pem'), // Read the private key file
  cert: fs.readFileSync('path/to/certificate.pem') // Read the certificate file
};

// Create a secure HTTPS server using the Express app and SSL/TLS certificates
const server = https.createServer(options, app);

server.listen(3001, () => {
  console.log("Secure server is running on port 3001"); // Log a message when the secure server is running
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    //console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    //console.log("User Disconnected", socket.id);
  });
});