const { spawn } = require("child_process");
const path = require("path");
const http = require("http");

const PUBLIC_PORT = process.env.PORT || "3000";
const SERVER_PORT = process.env.SERVER_PORT || process.env.EXPRESS_PORT || "5000";

console.log("==================================================");
console.log("Starting LMS Collective Full-Stack System");
console.log(`Public Port (Next.js Frontend):  ${PUBLIC_PORT}`);
console.log(`Internal Port (Express Backend): ${SERVER_PORT}`);
console.log("==================================================");

let serverProcess = null;
let clientProcess = null;
let isShuttingDown = false;

function checkBackendReady(port, maxRetries = 30, interval = 500) {
  return new Promise((resolve) => {
    let retries = 0;
    const check = () => {
      retries++;
      const req = http.get(`http://127.0.0.1:${port}/test`, (res) => {
        if (res.statusCode === 200) {
          console.log(`[system] Backend API verified healthy on port ${port}!`);
          resolve(true);
        } else {
          retry();
        }
      });

      req.on("error", () => {
        retry();
      });

      req.setTimeout(1000, () => {
        req.destroy();
        retry();
      });

      function retry() {
        if (retries >= maxRetries) {
          console.warn(`[system] Backend health check timed out after ${maxRetries * interval}ms. Starting frontend anyway.`);
          resolve(false);
        } else {
          setTimeout(check, interval);
        }
      }
    };

    check();
  });
}

function startBackend() {
  const serverEnv = {
    ...process.env,
    PORT: String(SERVER_PORT),
  };

  const serverScript = path.join(__dirname, "server", "dist", "server.js");

  serverProcess = spawn(process.execPath, [serverScript], {
    cwd: path.join(__dirname, "server"),
    env: serverEnv,
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

  const nextBin = path.join(__dirname, "client", "node_modules", "next", "dist", "bin", "next");

  clientProcess = spawn(process.execPath, [nextBin, "start"], {
    cwd: path.join(__dirname, "client"),
    env: clientEnv,
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

async function start() {
  // 1. Start backend process directly with node
  startBackend();

  // 2. Wait until backend is verified listening and healthy on port 5000
  await checkBackendReady(SERVER_PORT);

  // 3. Start Next.js frontend on public port
  startFrontend();
}

start();

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
