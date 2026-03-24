const http = require("http");
const app = require("./app");
const database = require("./config/database");
const config = require("./config/config");
const { initSocket } = require("./socket/socket");

const server = http.createServer(app); // 👈 wrap Express

initSocket(server); // 👈 attach Socket.IO

(async () => {
  try {
    await database.connect();

    server.listen(config.PORT, () => {
      console.log(`Server + Socket.IO running on ${config.PORT}`);
    });
  } catch (err) {
    console.error("Server startup error:", err);
    process.exit(1);
  }
})();
