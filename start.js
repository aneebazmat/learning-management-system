const { spawn } = require("child_process");
const path = require("path");

// Render assigns public port to process.env.PORT (e.g. 10000)
// If not set (local dev), default to 3000
const PUBLIC_PORT = process.env.PORT || "3000";

// Internal port for Express API backend
const SERVER_PORT = process.env.SERVER_PORT || process.env.EXPRESS_PORT || "5000";

console.log("==================================================");
console.log("Starting LMS Collective Full-Stack System");
console.log(`Public Port (Next.js Frontend):  ${PUBLIC_PORT}`);
console.log(`Internal Port (Express Backend): ${SERVER_PORT}`);
console.log("==================================================");

let serverProcess = null;
let clientProcess = null;
let isShuttingDown = false;

function startBackend() {
  const serverEnv = {
    ...process.env,
    PORT: String(SERVER_PORT),
  };

  serverProcess = spawn("npm", ["start"], {
    cwd: path.join(__dirname, "server"),
    env: serverEnv,
    shell: true,
    stdio: ["inherit", "pipe", "pipe"],
  });

  serverProcess.stdout.on("data", (data) => {
    process.stdout.write(`[backend] ${data}`);
  });

  serverProcess.stderr.on("data", (data) => {
    process.stderr.write(`[backend] ${data}`);
  });

  serverProcess.on("close", (code) => {
    console.log(`[backend] process stopped with exit code ${code}`);
    if (!isShuttingDown) {
      console.log("[backend] Restarting backend in 2 seconds...");
      setTimeout(startBackend, 2000);
    }
  });
}

function startFrontend() {
  const clientEnv = {
    ...process.env,
    PORT: String(PUBLIC_PORT),
    SERVER_PORT: String(SERVER_PORT),
    NEXT_PUBLIC_SERVER_URI: process.env.NEXT_PUBLIC_SERVER_URI || "/api/v1",
  };

  clientProcess = spawn("npm", ["start"], {
    cwd: path.join(__dirname, "client"),
    env: clientEnv,
    shell: true,
    stdio: ["inherit", "pipe", "pipe"],
  });

  clientProcess.stdout.on("data", (data) => {
    process.stdout.write(`[frontend] ${data}`);
  });

  clientProcess.stderr.on("data", (data) => {
    process.stderr.write(`[frontend] ${data}`);
  });

  clientProcess.on("close", (code) => {
    console.log(`[frontend] process stopped with exit code ${code}`);
    if (!isShuttingDown) {
      console.log("[frontend] Restarting frontend in 2 seconds...");
      setTimeout(startFrontend, 2000);
    }
  });
}

// Start both services
startBackend();
startFrontend();

function shutdown(code = 0) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log("\nGracefully shutting down LMS services...");

  try {
    if (process.platform === "win32") {
      if (serverProcess?.pid) spawn("taskkill", ["/pid", String(serverProcess.pid), "/f", "/t"]);
      if (clientProcess?.pid) spawn("taskkill", ["/pid", String(clientProcess.pid), "/f", "/t"]);
    } else {
      if (serverProcess) serverProcess.kill("SIGTERM");
      if (clientProcess) clientProcess.kill("SIGTERM");
    }
  } catch (_) {}

  setTimeout(() => process.exit(code), 1000);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
