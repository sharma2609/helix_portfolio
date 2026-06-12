import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const BACKEND = path.join(ROOT, "backend");
const PORT = process.env.BACKEND_PORT || "8000";

function venvPython() {
  const unix = path.join(BACKEND, ".venv/bin/python");
  if (fs.existsSync(unix)) return unix;
  return process.platform === "win32" ? "python" : "python3";
}

function setupBackend() {
  const venvDir = path.join(BACKEND, ".venv");
  const py = process.platform === "win32" ? "python" : "python3";

  if (!fs.existsSync(venvDir)) {
    spawnSync(py, ["-m", "venv", ".venv"], { cwd: BACKEND, stdio: "inherit" });
  }

  const pip = path.join(BACKEND, ".venv/bin/pip");
  const pipWin = path.join(BACKEND, ".venv/Scripts/pip.exe");
  const pipBin = fs.existsSync(pip) ? pip : pipWin;
  if (fs.existsSync(pipBin)) {
    spawnSync(pipBin, ["install", "-q", "-r", "requirements.txt"], {
      cwd: BACKEND,
      stdio: "inherit",
    });
  }
}

export function backendPlugin() {
  let proc = null;

  const start = () => {
    if (proc) return;
    setupBackend();
    const py = venvPython();
    proc = spawn(py, ["-m", "uvicorn", "main:app", "--reload", "--port", PORT], {
      cwd: BACKEND,
      stdio: "inherit",
      env: { ...process.env, PYTHONUNBUFFERED: "1" },
    });
    proc.on("exit", () => {
      proc = null;
    });
    console.log(`[helix] API http://127.0.0.1:${PORT}`);
  };

  const stop = () => {
    if (proc) {
      proc.kill("SIGTERM");
      proc = null;
    }
  };

  return {
    name: "helix-backend",
    configureServer(server) {
      start();
      server.httpServer?.on("close", stop);
    },
    buildEnd: stop,
  };
}
