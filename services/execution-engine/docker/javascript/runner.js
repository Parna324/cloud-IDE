const fs = require("fs");

const code = fs.readFileSync("/workspace/code.js", "utf8");

try {
  eval(code);
} catch (error) {
  console.error(error.message);
}
