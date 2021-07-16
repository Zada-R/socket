import { io } from "socket.io-client";

let num = 0;

// const socket = io("http://172.26.111.118:8000/my-namespace", {
//   transports: ["websocket"],
// });

const socket = io("http://localhost:8000", {
  path: "/my-namespace",
  // transports: ["websocket", "xhr-polling", "jsonp-polling"],
  transports: ["websocket", "polling"],
});

//?? 手动断开连接手动重连，需要emit-ping下么，要不怎么保留之前数据？？

function subscribeToTimer(cb) {
  // 连接成功后执行该函数
  socket.on("connect", () => {
    console.log(socket.id);
    console.log(socket);
    socket.on("timer", (timestamp) => cb(null, timestamp));
    socket.emit("subscribeToTimer", 1000);
  });

  const timer = setTimeout(() => {
    // socket.close();
    socket.disconnect();

    console.log(socket.connected);
    clearTimeout(timer);
    // console.log(socket);
  }, 5000);

  // 连接错误触发事件处理器 error 错误对象
  socket.on("connect_error", (error) => {
    console.log("connect_error", error);
    ++num;
    console.log(num);
    // 默认自动重连，超过重连次数手动关闭socket
    if (num >= 10) {
      socket.close();
    }
  });

  // 丢失连接时触发时间处理器 reason （字符串） 服务器或客户端丢失连接的原因
  socket.on("disconnect", (reason) => {
    console.log("disconnect", reason);
    // 连接已关闭（例如：用户已失去连接，或网络已从 WiFi 更改为 4G）
    // socket自动尝试重新连接
    if (reason === "transport close") {
      // socket.close();
    }
    //连接遇到错误（例如：服务器在 HTTP 长轮询周期中被杀死）
    // socket自动尝试
    if (reason === "transport error") {
      // socket.close();
    }
    // 显式断开连接，客户端不会尝试重新连接，您需要手动调用socket.connect()
    if (
      reason === "io server disconnect" ||
      reason === "io client disconnect"
    ) {
      socket.connect();
    }
  });

  // 成功的重连时触发时间处理器 attempt （字符串） 重连次数
  socket.on("reconnect", (attempt) => {
    console.log("reconnect", attempt);
  });

  // 尝试重连
  socket.io.on("reconnect_attempt", (attempt) => {
    console.log("reconnect_attempt", attempt);
  });

  // 尝试重连时触发时间处理器 attempt （字符串） 尝试重连次数
  socket.io.on("reconnect_attempt", (attempt) => {
    console.log("reconnect_attempt", attempt);
  });

  // 重连错误时触发时间处理器
  socket.io.on("reconnect_error", (error) => {
    console.log("reconnect_error", error);
  });

  // 无法重新连接时触发
  socket.io.on("reconnect_failed", () => {
    console.log("内无法重新连接时触发");
  });

  // 从服务器接收到 ping 数据包时触发
  socket.io.on("ping", () => {
    console.log("从服务器接收到 ping 数据包时触发");
  });
}

export { subscribeToTimer };
