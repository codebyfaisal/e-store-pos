import {
  jwtSecretAccessToken,
  jwtSecretRefreshToken,
} from "../config/env.config.js";
import verifyAndAttachUserToken from "../utils/verifyAndAttachUserToken.js";
import client from "../config/supabaseClient.config.js";

const authenticate = async (req, res, next) => {
  try {
    const accessToken = req?.cookies?.accessToken;

    if (!accessToken)
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: No token found" });


    await verifyAndAttachUserToken(
      accessToken,
      jwtSecretAccessToken,
      req,
      res,
      next
    );
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: You do not have permission",
      });
    }
    next();
  };
};

const checkInvitation = async (req, res, next) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ success: false, error: "Email is required" });


  try {
    const response = await client.query(
      `
      SELECT *
      FROM invite_users
      WHERE email = $1
      LIMIT 1
      `,
      [email]
    );

    if (response.rows?.length === 0) {
      return res.status(401).json({
        success: false,
        error: "You are not invited. Please contact the administrator",
      });
    }

    req.body.role = response.rows[0].role;
    req.body.inviteUserId = response.rows[0].invite_user_id;

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

const verifyRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken)
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: No token found" });

    verifyAndAttachUserToken(
      refreshToken,
      jwtSecretRefreshToken,
      req,
      res,
      next
    );
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export { authenticate, checkInvitation, authorizeRole, verifyRefreshToken };
