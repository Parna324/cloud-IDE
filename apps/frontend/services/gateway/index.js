const express = require("express");
const cors = require("cors");

const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(cors());

app.use(
  "/api/code",
  createProxyMiddleware({
    target: "http://localhost:5002",
    changeOrigin: true,
  }),
);

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
  }),
);

app.listen(5000, () => {
  console.log("Gateway running");
});
