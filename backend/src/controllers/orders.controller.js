import client from "../config/supabaseClient.config.js";

// GET /orders - Get all orders
const getOrders = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT 
        o.order_id,
        c.first_name || ' ' || c.last_name AS customer_name,
        o.order_date,
        o.status,
        o.total_amount,
        o.payment_status
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      ORDER BY o.created_at DESC;
      `);

    if (result.rows?.length === 0) {
      return res.status(404).json({ success: false, error: "No orders found" });
    }

    return res.status(200).json({ success: true, result: result.rows });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch orders" });
  }
};

// PUT /orders/:id - Update an existing order
const updateOrder = async (req, res) => {
  try {
    const { id, status } = req.body;
    const result = await client.query(
      `
      UPDATE orders
      SET status = $1
      WHERE order_id = $2
      RETURNING *
      `,
      [status.toLowerCase(), id]
    );

    if (result.rows?.length === 0)
      return res.status(404).json({ success: false, error: "Order not found" });

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: result[0],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to update order" });
  }
};

export { getOrders, updateOrder };
