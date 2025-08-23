import client from "../config/supabaseClient.config.js";
import { verifyToken } from "./jwt.utils.js";

const verifyAndAttachUserToken = async (token, secret, req, res, next) => {
  try {
    const decoded = await verifyToken(token, secret);

    const result = await client.query(
      `SELECT * FROM users WHERE user_id = $1`,
      [decoded.user_id]
    );

    if (result.rows?.length === 0)
      return res.status(404).json({ success: false, error: "User not found" });

    if (result.rows[0].refresh_token !== req.cookies.refreshToken)
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: Invalid token" });

    req.user = result.rows[0];

    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: error.message });
  }
};

export default verifyAndAttachUserToken;
