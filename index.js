const http = require("http");
const handler = require("./handler.js");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(handler);
const io = new Server(httpServer);

// Io connection that shows that we are connected
io.on("connection", (socket)=>{
  console.log( "we are connected ")
}) 

httpServer.listen(PORT, () => console.log(`server is running at  ${PORT}`));
