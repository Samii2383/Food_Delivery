import crypto from "crypto";

export function requestId() {
  return function requestIdMiddleware(req, res, next) {
    const incoming = req.headers["x-request-id"];
    const id =
      typeof incoming === "string" && incoming.trim()
        ? incoming.trim()
        : crypto.randomUUID();

    req.id = id;
    res.setHeader("x-request-id", id);
    next();
  };
}

