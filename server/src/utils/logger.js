const levelPriority = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

function nowIso() {
  return new Date().toISOString();
}

function stringifyMeta(meta) {
  if (!meta) return "";
  if (meta instanceof Error) {
    return JSON.stringify({
      name: meta.name,
      message: meta.message,
      stack: meta.stack
    });
  }
  try {
    return JSON.stringify(meta);
  } catch {
    return String(meta);
  }
}

function makeLogger({ minLevel = "info" } = {}) {
  const min = levelPriority[minLevel] ?? levelPriority.info;
  const log = (level, msg, meta) => {
    if ((levelPriority[level] ?? 999) < min) return;
    const line = `[${nowIso()}] ${level.toUpperCase()} ${msg}`;
    const extra = stringifyMeta(meta);
    console[level === "debug" ? "log" : level](extra ? `${line} ${extra}` : line);
  };

  return {
    debug: (msg, meta) => log("debug", msg, meta),
    info: (msg, meta) => log("info", msg, meta),
    warn: (msg, meta) => log("warn", msg, meta),
    error: (msg, meta) => log("error", msg, meta)
  };
}

export const logger = makeLogger({
  minLevel: process.env.NODE_ENV === "production" ? "info" : "debug"
});

