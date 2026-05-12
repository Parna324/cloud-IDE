const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");
const { v4: uuid } = require("uuid");

const Docker = require("dockerode");

const docker = new Docker();

const languageConfig = require("./config/languages");

const app = express();

app.use(cors());
app.use(express.json());

const TEMP_DIR = path.join(__dirname, "../temp");

fs.ensureDirSync(TEMP_DIR);

app.get("/", (req, res) => {
  res.json({
    message: "Execution Engine Running",
  });
});

app.post("/execute", async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        error: "Code and language are required",
      });
    }

    const config = languageConfig[language];

    if (!config) {
      return res.status(400).json({
        error: "Unsupported language",
      });
    }

    const jobId = uuid();

    const tempDir = path.join(TEMP_DIR, jobId);

    await fs.ensureDir(tempDir);

    const codePath = path.join(tempDir, config.filename);

    await fs.writeFile(codePath, code);

    const container = await docker.createContainer({
      Image: config.image,

      Tty: false,

      HostConfig: {
        Binds: [`${tempDir}:/workspace`],

        Memory: 128 * 1024 * 1024,

        NanoCPUs: 500000000,

        NetworkMode: "none",

        AutoRemove: true,
      },
    });

    await container.start();

    const result = await container.wait();

    const logs = await container.logs({
      stdout: true,
      stderr: true,
    });

    const output = logs.toString();

    console.log("Container Result:", result);
    console.log("Logs:", output);
    await fs.remove(tempDir);

    res.json({
      success: true,
      output,
    });
  } catch (error) {

    console.log(error);
  
    res.status(500).json({
      error: error.message,
    });
  }

app.listen(5002, () => {
  console.log("Execution engine running on port 5002");
});
