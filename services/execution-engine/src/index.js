const express = require("express");
const http = require("http");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");
const { randomUUID } = require("crypto");
const { PassThrough } = require("stream");

const Docker = require("dockerode");
const tar = require("tar-fs");

const docker = new Docker();

const languageConfig = require("./config/languages");
const initSocket = require("./socket");

const app = express();
const server = http.createServer(app);
const io = initSocket(server);
const port = Number(process.env.PORT) || 5002;

app.use(cors());
app.use(express.json());

const TEMP_DIR = path.join(__dirname, "../temp");

fs.ensureDirSync(TEMP_DIR);

async function collectContainerLogs(container, handlers = {}) {
  const logStream = await container.logs({
    stdout: true,
    stderr: true,
    follow: true,
  });

  const stdoutChunks = [];
  const stderrChunks = [];
  const stdoutStream = new PassThrough();
  const stderrStream = new PassThrough();

  container.modem.demuxStream(logStream, stdoutStream, stderrStream);

  stdoutStream.on("data", (chunk) => {
    stdoutChunks.push(chunk);
    if (handlers.onStdout) {
      handlers.onStdout(chunk);
    }
  });

  stderrStream.on("data", (chunk) => {
    stderrChunks.push(chunk);
    if (handlers.onStderr) {
      handlers.onStderr(chunk);
    }
  });

  await new Promise((resolve, reject) => {
    logStream.on("end", resolve);
    logStream.on("error", reject);
  });

  return {
    stdout: Buffer.concat(stdoutChunks).toString("utf8"),
    stderr: Buffer.concat(stderrChunks).toString("utf8"),
  };
}

function normalizeCodeInput(code) {
  if (typeof code !== "string") {
    return code;
  }

  return code
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t");
}

app.get("/", (req, res) => {
  res.json({
    message: "Execution Engine Running",
  });
});

app.post("/execute", async (req, res) => {
  let container = null;
  let tempDir = null;
  let jobId = null;

  try {
    const { code, language } = req.body;

    console.log("Execute request received", {
      language,
      codeSize: typeof code === "string" ? code.length : null,
      hasCode: Boolean(code),
      hasLanguage: Boolean(language),
    });

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

    jobId = randomUUID();

    tempDir = path.join(TEMP_DIR, jobId);

    const workspaceDir = path.join(tempDir, "workspace");

    await fs.ensureDir(workspaceDir);

    const codePath = path.join(workspaceDir, config.filename);

    const normalizedCode = normalizeCodeInput(code);

    await fs.writeFile(codePath, normalizedCode);

    container = await docker.createContainer({
      Image: config.image,

      Tty: false,

      HostConfig: {
        Memory: 128 * 1024 * 1024,

        NanoCPUs: 500000000,

        NetworkMode: "none",

        AutoRemove: false,
      },
    });

    await container.putArchive(tar.pack(tempDir), {
      path: "/",
    });

    console.log("Container created", {
      jobId,
      containerId: container.id,
      image: config.image,
      filename: config.filename,
    });

    await container.start();

    console.log("Container started", {
      jobId,
      containerId: container.id,
    });

    io.to(jobId).emit("start", {
      jobId,
      language,
    });

    const [result, logs] = await Promise.all([
      container.wait(),
      collectContainerLogs(container, {
        onStdout: (chunk) =>
          io.to(jobId).emit("output", {
            jobId,
            stream: "stdout",
            chunk: chunk.toString("utf8"),
          }),
        onStderr: (chunk) =>
          io.to(jobId).emit("output", {
            jobId,
            stream: "stderr",
            chunk: chunk.toString("utf8"),
          }),
      }),
    ]);

    const output = `${logs.stdout}${logs.stderr}`;

    console.log("Container Result:", result);

    console.log("Logs (stdout):", logs.stdout);
    console.log("Logs (stderr):", logs.stderr);
    console.log("Logs (combined):", output);

    res.json({
      success: true,
      jobId,
      output,
      stdout: logs.stdout,
      stderr: logs.stderr,
    });

    io.to(jobId).emit("done", {
      jobId,
      statusCode: result.StatusCode,
    });
  } catch (error) {
    console.log("Execute error:", {
      message: error.message,
      stack: error.stack,
      jobId,
      containerId: container ? container.id : null,
      tempDir,
    });

    if (jobId) {
      io.to(jobId).emit("error", {
        jobId,
        message: error.message,
      });
    }

    res.status(500).json({
      error: error.message,
    });
  } finally {
    if (container) {
      try {
        const status = await container.inspect();
        console.log("Container inspect before cleanup", {
          jobId,
          containerId: container.id,
          status: status.State,
        });

        await container.remove({ force: true });
      } catch (cleanupError) {
        console.log("Container cleanup error:", {
          message: cleanupError.message,
          stack: cleanupError.stack,
          jobId,
          containerId: container.id,
        });
      }
    }

    if (tempDir) {
      try {
        await fs.remove(tempDir);
      } catch (cleanupError) {
        console.log("Temp cleanup error:", {
          message: cleanupError.message,
          stack: cleanupError.stack,
          jobId,
          tempDir,
        });
      }
    }
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${port} is already in use. Stop the existing service or run with PORT=<available-port>.`,
    );
    process.exit(1);
  }

  throw error;
});

server.listen(port, () => {
  console.log(`Execution engine running on port ${port}`);
});
