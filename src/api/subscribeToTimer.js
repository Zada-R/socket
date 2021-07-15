import { io } from "socket.io-client";

const socket = io("http://172.26.111.118:8000/my-namespace", {
  transports: ["websocket"],
});

function subscribeToTimer(cb) {
  socket.on("connect", () => {
    console.log(socket.id);
    setTimeout(() => {
      // socket.close();
      socket.disconnect();
      console.log(socket.connected);
      console.log(socket);
    }, 5000);
  });
  socket.on("timer", (timestamp) => cb(null, timestamp));
  socket.emit("subscribeToTimer", 1000);
}

export { subscribeToTimer };
