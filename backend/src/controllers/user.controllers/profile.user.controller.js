import { superAdminEmail } from "../../config/env.config.js";
import client from "../../config/supabaseClient.config.js";
import { passCompare, passHash } from "../../utils/bcrypt.utils.js";

const getUserProfile = async (req, res) => {
  const id = req.user.user_id;

  try {
    const result = await client.query(
      `SELECT 
        email, fname, lname, role, created_at
      FROM users
      WHERE user_id = $1`,
      [id]
    );

    if (result.rows?.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({
      success: true,
      result: [result.rows[0]],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch the user" });
  }
};

const updateUserProfile = async (req, res) => {
  const id = req.user.user_id;
  const { email, fname, lname } = req.body;

  try {
    const result = await client.query(
      `UPDATE users
      SET email = $1, fname = $2, lname = $3
      WHERE user_id = $4
      RETURNING *`,
      [email, fname, lname, id]
    );

    if (result.rows?.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({
      success: true,
      result: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }
    return res
      .status(500)
      .json({ success: false, error: "Failed to update the user" });
  }
};

const deleteUserProfile = async (req, res) => {
  const { user_id: id, role } = req.user;

  try {
    if (role === "admin") {
      const result = await client.query(
        `
        SELECT email FROM users 
        WHERE user_id = $1`,
        [id]
      );

      if (result.rows?.length === 0)
        return res
          .status(404)
          .json({ success: false, error: "User not found" });

      if (result.rows[0].email === superAdminEmail)
        return res.status(400).json({
          success: false,
          error: "You are the only Super Admin. Cannot delete yourself",
        });
    }

    const result = await client.query(
      `DELETE FROM users
      WHERE user_id = $1
      RETURNING user_id, email, role, created_at`,
      [id]
    );

    if (result.rows?.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({
      success: true,
      result: result.rows[0],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete the user" });
  }
};

const changeUserPassword = async (req, res) => {
  try {
    const id = req.user.user_id;
    const { newPassword, confirmNewPassword, currentPassword } = req.body;

    if (newPassword === currentPassword)
      return res
        .status(400)
        .json({ success: false, error: "New password cannot be the same" });

    if (newPassword !== confirmNewPassword)
      return res
        .status(400)
        .json({ success: false, error: "Confirm password does not match" });

    if (newPassword.length < 8)
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters",
      });

    const user = await client.query(
      `SELECT password_hash
       FROM users WHERE user_id = $1`,
      [id]
    );

    const isPasswordValid = await passCompare(
      currentPassword,
      user.rows[0].password_hash
    );

    if (!isPasswordValid)
      return res
        .status(401)
        .json({ success: false, error: "Invalid password" });

    const hashPassword = await passHash(newPassword);

    const result = await client.query(
      `UPDATE users
      SET password_hash = $1
      WHERE user_id = $2
      RETURNING user_id, email, role, created_at`,
      [hashPassword, id]
    );

    if (result.rows?.length === 0)
      return res.status(404).json({ success: false, error: "User not found" });

    return res.status(200).json({
      success: true,
      result: result.rows[0],
      message: "Successfully change Password",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to update the user" });
  }
};

export {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  deleteUserProfile,
};
