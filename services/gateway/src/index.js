require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const authTarget = process.env.AUTH_SERVICE_URL || "http://localhost:5001";
const executionTarget =
  process.env.EXECUTION_ENGINE_URL || "http://localhost:5002";

app.use(cors());

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: authTarget,
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": "",
    },
  }),
);

app.use(
  "/api/code",
  createProxyMiddleware({
    target: executionTarget,
    changeOrigin: true,
    pathRewrite: {
      "^/api/code": "",
    },
  }),
);

app.get("/", (req, res) => {
  res.json({
    message: "Gateway Running",
  });
});

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Gateway running on port ${port}`);
});
