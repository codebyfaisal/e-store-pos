import client from "../config/supabaseClient.config.js";

// Get all Sales Returns
const getSalesReturns = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT 
        sr.return_id,
        s.sale_id,
        sr.return_date,
        sr.return_reason,
        sr.status,
        sr.returned_quantity,
        s.total_amount AS sale_total_amount,
        s.sale_date,
        p.name AS product_name,
        oi.quantity AS sold_quantity,
        oi.price AS total_payment
      FROM sales_returns sr
      JOIN order_items oi ON sr.order_item_id = oi.order_item_id
      JOIN products p ON p.product_id = oi.product_id
      JOIN orders o ON o.order_id = oi.order_id
      JOIN sales s ON s.order_id = o.order_id
      ORDER BY sr.return_date DESC;
    `);

    if (result.rows?.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No Sales Returns found" });
    }

    return res.status(200).json({ success: true, result: result.rows });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch Sales Returns" });
  }
};

export { getSalesReturns };
