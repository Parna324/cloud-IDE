function resolveRunnerImage(serviceName, fallbackImage) {
  const imagePrefix = process.env.RUNNER_IMAGE_PREFIX;
  const imageTag = process.env.RUNNER_IMAGE_TAG;

  if (!imagePrefix) {
    return fallbackImage;
  }

  const baseImage = `${imagePrefix}/${serviceName}`;

  if (!imageTag) {
    return baseImage;
  }

  return `${baseImage}:${imageTag}`;
}

module.exports = {
  python: {
    image: resolveRunnerImage("python", "cloud-ide-python"),
    filename: "code.py",
  },

  javascript: {
    image: resolveRunnerImage("javascript", "cloud-ide-node"),
    filename: "code.js",
  },

  cpp: {
    image: resolveRunnerImage("cpp", "cloud-ide-cpp"),
    filename: "code.cpp",
  },

  java: {
    image: resolveRunnerImage("java", "cloud-ide-java"),
    filename: "Main.java",
  },
};
