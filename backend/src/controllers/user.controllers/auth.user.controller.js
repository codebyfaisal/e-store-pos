import client from "../../config/supabaseClient.config.js";
import { passHash, passCompare } from "../../utils/bcrypt.utils.js";
import { generateToken } from "../../utils/jwt.utils.js";

import {
  jwtSecretAccessToken,
  jwtAccessTokenExpiry,
  jwtSecretRefreshToken,
  jwtRefreshTokenExpiry,
} from "../../config/env.config.js";
import usersPermissions from "../../roles/users.roles.js";

const registerUser = async (req, res) => {
  try {
    const { email, password, fname, lname, role, inviteUserId } = req.body;

    if (!fname || !lname)
      return res.status(400).json({
        success: false,
        error: "First name and last name is required",
      });

    if (!password)
      return res
        .status(400)
        .json({ success: false, error: "Password is required" });


    if (!role)
      return res
        .status(400)
        .json({ success: false, error: "Role is required" });


    const hashPassword = await passHash(password);

    const result = await client.query(
      `INSERT INTO users (email, fname, lname, password_hash, role)
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING user_id, fname, lname, email, role, created_at`,
      [email, fname, lname, hashPassword, role]
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ success: false, error: "User already exists, please login" });
    }
    return res
      .status(500)
      .json({ success: false, error: "Failed to insert user" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });
  }

  try {
    const result = await client.query(
      `
      SELECT * FROM users 
      WHERE email = $1`,
      [email]
    );

    if (result.rows?.length === 0)
      return res.status(404).json({ success: false, error: "User not found" });

    const user = result.rows[0];

    const isPasswordValid = await passCompare(password, user.password_hash);

    if (!isPasswordValid)
      return res
        .status(401)
        .json({ success: false, error: "Invalid password" });

    const accessToken = generateToken(
      {
        sub: "accessToken",
        user_id: user.user_id,
        role: user.role,
      },
      jwtSecretAccessToken,
      jwtAccessTokenExpiry
    );
    const refreshToken = generateToken(
      {
        sub: "refreshToken",
        user_id: user.user_id,
        role: user.role,
      },
      jwtSecretRefreshToken,
      jwtRefreshTokenExpiry
    );

    const result1 = await client.query(
      `
      UPDATE users 
      SET refresh_token = $1
      WHERE email = $2
      RETURNING *`,
      [refreshToken, email]
    );

    if (result1.rows?.length === 0)
      return res
        .status(500)
        .json({ success: false, error: "Failed to update refresh token" });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        email: user.email,
        role: user.role,
        permissions: usersPermissions[user.role],
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to log in user" });
  }
};

const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    const result = await client.query(
      `
      UPDATE users 
      SET refresh_token = NULL
      WHERE refresh_token = $1
      RETURNING *`,
      [refreshToken]
    );

    if (result.rows?.length === 0)
      throw new Error("Failed to delete refresh token");

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ success: false, error: error.message });

    return res
      .status(500)
      .json({ success: false, error: "Failed to log out user" });
  }
};

const refreshUserToken = async (req, res) => {
  try {
    const { user_id, sub, role } = req.user;

    const newRefreshToken = generateToken(
      { user_id, sub, role },
      jwtSecretRefreshToken,
      jwtRefreshTokenExpiry
    );

    const newAccessToken = generateToken(
      { user_id, sub, role },
      jwtSecretAccessToken,
      jwtAccessTokenExpiry
    );

    const result = await client.query(
      `
        UPDATE users
        SET refresh_token = $1
        WHERE user_id = $2
        RETURNING user_id, email, role, created_at`,
      [newRefreshToken, user_id]
    );

    if (result.rows?.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      result: result.rows[0],
      permissions: usersPermissions[role],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to Refresh user token" });
  }
};

export { registerUser, loginUser, logoutUser, refreshUserToken };
