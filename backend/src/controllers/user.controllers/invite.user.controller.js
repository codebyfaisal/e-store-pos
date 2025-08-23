import { superAdminEmail } from "../../config/env.config.js";
import client from "../../config/supabaseClient.config.js";

const getInvitesQuery = {
  general: `
      SELECT 
        invite_user_id,
        email,
        role,
        status,
        created_at as invited_at
      FROM invite_users`,
  admin: `
      SELECT 
        invite_user_id,
        email,
        role,
        status,
        created_at as invited_at
      FROM invite_users
      WHERE email != $1`,
};

const getInvites = async (req, res) => {
  try {
    const result = await client.query(getInvitesQuery.admin, [superAdminEmail]);

    if (result?.rows?.length === 0)
      return res
        .status(404)
        .json({ success: false, error: "No Invited users found" });

    return res.status(200).json({ success: true, result: result.rows });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch users" });
  }
};

const addInvite = async (req, res) => {
  try {
    const { email, role } = req.body;

    const result = await client.query(
      `
      INSERT INTO invite_users (email, role)
      VALUES ($1, $2)
      RETURNING invite_user_id, email, role, created_at`,
      [email, role]
    );

    if (result.rows?.length === 0)
      return res.status(404).json({ success: false, error: "User not found" });

    return res.status(200).json({ success: true, result: result.rows[0] });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch the user" });
  }
};

const updateInvite = async (req, res) => {
  try {
    const { email, role } = req.body;

    const result = await client.query(
      `
      UPDATE invite_users
      SET role = $1
      WHERE email = $2
      RETURNING invite_user_id, email, role, status, created_at`,
      [role, email]
    );

    if (result.rows?.length === 0)
      return res.status(404).json({ success: false, error: "User not found" });

    return res.status(200).json({ success: true, result: result.rows[0] });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch the user" });
  }
};

const deleteInvite = async (req, res) => {
  try {
    const { email } = req.params;

    const result = await client.query(
      `
      DELETE FROM invite_users
      WHERE email = $1
      RETURNING invite_user_id, email, role, status, created_at`,
      [email]
    );

    if (result.rows?.length === 0)
      return res.status(404).json({ success: false, error: "User not found" });

    return res.status(200).json({ success: true, result: result.rows[0] });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch the user" });
  }
};

export { getInvites, addInvite, updateInvite, deleteInvite };
