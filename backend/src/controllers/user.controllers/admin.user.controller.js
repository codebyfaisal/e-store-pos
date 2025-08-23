import client from "../../config/supabaseClient.config.js";

const getUsers = async (req, res) => {
  try {
    const { user_id } = req.user;

    const result = await client.query(
      `
      SELECT 
        user_id,
        email,
        fname,
        lname,
        role,
        created_at
      FROM users
      WHERE user_id != $1`,
      [user_id]
    );

    if (result.rows?.length === 0 && result.rowCount === 0) {
      return res
        .status(200)
        .json({ success: true, result: [], message: "No users found" });
    }

    return res.status(200).json({ success: true, result: result.rows });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch users" });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await client.query(
      `
      SELECT 
        user_id,
        email,
        fname,
        lname,
        role,
        created_at
      FROM users
      WHERE user_id = $1`,
      [id]
    );

    if (result.rows?.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, result: result.rows[0] });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch the user" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email, role } = req.body;

    const result = await client.query(
      `
      UPDATE users
      SET role = $1
      WHERE email = $2
      RETURNING user_id, email, role, created_at`,
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

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.user_id) {
      return res
        .status(400)
        .json({ success: false, error: "You cannot delete yourself" });
    }

    const result = await client.query(
      `
        DELETE FROM users
        WHERE user_id = $1 and role != 'admin'
        RETURNING user_id, email, role, created_at`,
      [id]
    );

    if (result.rows?.length === 0)
      return res.status(404).json({ success: false, error: "User not found" });

    return res.status(200).json({ success: true, result: result.rows[0] });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete the user" });
  }
};

const getActivities = async (req, res) => {
  const { limit = 10, page = 0 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const queries = [
      `SELECT * FROM notifications_log LIMIT $1 OFFSET $2;`,
      `SELECT COUNT(*) FROM notifications_log;`,
    ];

    const [notifications, totalNotifications] = await Promise.all([
      client.query(queries[0], [limit, offset]),
      client.query(queries[1]),
    ]);

    return res.status(200).json({
      success: true,
      result: [
        {
          notifications: [...notifications.rows],
          totalNotifications: totalNotifications.rows[0].count,
        },
      ],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { getUsers, getUser, updateUser, deleteUser, getActivities };
