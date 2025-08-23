import client from "../config/supabaseClient.config.js";

const totalsQuery = `
      SELECT
        COALESCE(SUM(s.total_amount), 0) AS total_sales,
        (SELECT COUNT(*) FROM orders) AS total_orders,
        (SELECT COUNT(*) FROM sales_returns) AS total_returns
      FROM sales s;
    `;

const weeklySalesQuery = `
      SELECT
        TO_CHAR(DATE(sale_date), 'Dy') AS day,
        SUM(total_amount)::numeric(10,2) AS amount
      FROM sales
      WHERE sale_date >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY DATE(sale_date)
      ORDER BY DATE(sale_date)
    `;

const orderStatusQuery = `
      SELECT 
        status, COUNT(*) AS count
      FROM orders
      GROUP BY status
    `;

const paymentMethodsQuery = `
      SELECT 
        LOWER(payment_method) AS method,
        COUNT(*) AS count
      FROM sales
      GROUP BY payment_method
    `;

const salesComparisonQuery = `
      SELECT 
        SUM(CASE WHEN order_date BETWEEN CURRENT_DATE - INTERVAL '6 days' AND CURRENT_DATE THEN total_amount ELSE 0 END) AS current_week,
        SUM(CASE WHEN order_date BETWEEN CURRENT_DATE - INTERVAL '13 days' AND CURRENT_DATE - INTERVAL '7 days' THEN total_amount ELSE 0 END) AS last_week
      FROM orders
    `;

const topProductsQuery = `
      SELECT 
        p.product_id,
        p.name AS product_name,
        SUM(oi.quantity) AS units_sold,
        SUM(oi.quantity * oi.price)::numeric(10,2) AS revenue
      FROM order_items oi
      JOIN products p ON p.product_id = oi.product_id
      GROUP BY p.product_id
      ORDER BY units_sold DESC
      LIMIT 3;
    `;

// 🕒 Recent Orders
const recentOrdersQuery = `
      SELECT 
        o.order_id,
        CONCAT(c.first_name, ' ', c.last_name) AS customer,
        o.status,
        o.total_amount
      FROM orders o
      JOIN customers c ON c.customer_id = o.customer_id
      ORDER BY o.created_at DESC
      LIMIT 5;
    `;

// 👥 Top Buying Customers
const topCustomersQuery = `
      SELECT 
        c.customer_id,
        CONCAT(c.first_name, ' ', c.last_name) AS customer,
        COUNT(o.order_id) AS orders,
        SUM(o.total_amount)::numeric(10,2) AS total_spent
      FROM customers c
      JOIN orders o ON o.customer_id = c.customer_id
      GROUP BY c.customer_id
      ORDER BY total_spent DESC
      LIMIT 3;
    `;

const getDashboardData = async (req, res) => {
  try {
    const [
      { rows: [totals] },
      { rows: weeklySales },
      { rows: orderStatus },
      { rows: paymentMethods },
      { rows: salesComparison },
      { rows: topProducts },
      { rows: recentOrders },
      { rows: topCustomers },
    ] = await Promise.all([
      client.query(totalsQuery),
      client.query(weeklySalesQuery),
      client.query(orderStatusQuery),
      client.query(paymentMethodsQuery),
      client.query(salesComparisonQuery),
      client.query(topProductsQuery),
      client.query(recentOrdersQuery),
      client.query(topCustomersQuery),
    ]);

    const result = {
      kpis: {
        total_sales: totals.total_sales,
        total_orders: totals.total_orders,
        total_returns: totals.total_returns,
      },
      weekly_sales: weeklySales,
      order_status: orderStatus,
      payment_methods: paymentMethods,
      sales_comparison: salesComparison,
      top_products: topProducts,
      recent_orders: recentOrders,
      top_customers: topCustomers,
    };

    return res.status(200).json({ success: true, result: [result] });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch dashboard data" });
  }
};

export { getDashboardData };

