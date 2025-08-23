import arcjetLib from "../lib/arcjet.lib.js";
import { isSpoofedBot } from "@arcjet/inspect";

const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.connection?.remoteAddress ||
    req.ip
  );
};

const response = (res, code, message) =>
  res.status(code).json({ success: false, error: message });


const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await arcjetLib.protect(req, {
      requested: 1,
      ip: getClientIp(req),
    });

    if (decision.isDenied()) {
      const reason = decision.reason;

      if (reason.isRateLimit())
        return response(res, 429, "Too Many Requests");


      if (reason.isBot())
        return response(res, 403, "No bots allowed");

      return response(res, 403, "Forbidden");
    }

    if (decision.results.some(isSpoofedBot))
      return response(res, 403, "Spoofed bot blocked");


    next();
  } catch (err) {
    console.error("[Arcjet Error]", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export default arcjetMiddleware;
