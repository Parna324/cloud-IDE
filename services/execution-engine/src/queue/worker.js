const { Worker } = require("bullmq");
const { connection } = require("./queue");

const worker = new Worker(
  "execution-jobs",
  async (job) => {
    const { code, language } = job.data;

    // TODO: invoke Docker execution flow here
    return {
      status: "queued",
      language,
      codeSize: typeof code === "string" ? code.length : 0,
    };
  },
  {
    connection,
  },
);

worker.on("completed", (job) => {
  console.log("Job completed", {
    id: job.id,
    name: job.name,
  });
});

worker.on("failed", (job, error) => {
  console.log("Job failed", {
    id: job && job.id,
    name: job && job.name,
    error: error.message,
  });
});

module.exports = worker;
