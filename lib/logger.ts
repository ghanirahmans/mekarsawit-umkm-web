import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");
const logFile = path.join(logDir, "app.log");

function ensureLogDir() {
  try {
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  } catch (error) {
    console.error("log_dir_error", error);
  }
}

function writeLine(message: string) {
  // Avoid filesystem writes on Vercel/serverless; fall back to console
  if (process.env.VERCEL) {
    console.log(message);
    return;
  }

  ensureLogDir();
  try {
    fs.appendFileSync(logFile, message + "\n", { encoding: "utf8" });
  } catch (error) {
    console.error("log_write_error", error);
  }
}

type LogPayload = Record<string, unknown>;

function log(category: string, payload: LogPayload) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    category,
    ...payload,
  });
  writeLine(line);
}

export function logAuth(payload: LogPayload) {
  log("auth", payload);
}

export function logDebug(category: string, payload: LogPayload) {
  log(category, payload);
}
