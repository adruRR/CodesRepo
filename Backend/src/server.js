require("dotenv").config();
const spdy = require("spdy");
const fs = require("node:fs");
const app = require("./app");

const options = {
  key: fs.readFileSync("./cert/key.pem"),
  cert: fs.readFileSync("./cert/cert.pem"),
};

spdy.createServer(options, app).listen(process.env.PORT, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log(`API running on https://localhost:${process.env.PORT}`);
});
