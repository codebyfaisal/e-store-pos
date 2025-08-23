import client from "../config/supabaseClient.config.js";

const salesReturnReportQueries = {
  kpiStats: `
    SELECT
      (SELECT COALESCE(SUM(total_amount), 0) FROM sales) AS sales,
      (SELECT COUNT(*) FROM orders) AS orders,
      (SELECT COALESCE(SUM(quantity), 0) FROM order_items) AS products_sold,
      (SELECT COUNT(*) FROM invoices WHERE status = 'paid') AS invoices_paid;
  `,

  salesOverTime: `
    SELECT
      TO_CHAR(sale_date, 'Mon') AS month,
      SUM(total_amount) AS sales
    FROM sales
    GROUP BY month
    ORDER BY MIN(sale_date);
  `,

  topProducts: `
    SELECT
      p.name AS name,
      SUM(oi.quantity) AS quantity,
      SUM(oi.price * oi.quantity) AS revenue
    FROM order_items oi
    JOIN products p ON p.product_id = oi.product_id
    GROUP BY p.name
    ORDER BY revenue DESC
    LIMIT 5;
  `,

  categorySales: `
    SELECT
      c.name AS category,
      SUM(oi.price * oi.quantity) AS totalSales
    FROM order_items oi
    JOIN products p ON p.product_id = oi.product_id
    JOIN categories c ON c.category_id = p.category_id
    GROUP BY c.name
    ORDER BY totalSales DESC;
  `,

  salesReturns: `
    SELECT
      return_reason AS reason,
      COUNT(*) AS count
    FROM sales_returns
    GROUP BY return_reason
    ORDER BY count DESC;
  `,

  monthlyRevenue: `
    SELECT
      TO_CHAR(sale_date, 'Mon') AS month,
      DATE_TRUNC('month', sale_date) AS monthDate,
      payment_method AS paymentMethod,
      SUM(total_amount) AS revenue
    FROM sales
    GROUP BY month, monthDate, paymentMethod
    ORDER BY monthDate, paymentMethod;
  `,

  revenueByPaymentMethod: `
    SELECT
      payment_method AS method,
      SUM(total_amount) AS revenue
    FROM sales
    GROUP BY payment_method;
  `,

  salesByCustomer: `
    SELECT
      CONCAT(c.first_name, ' ', c.last_name) AS customer,
      SUM(s.total_amount) AS total
    FROM sales s
    JOIN orders o ON o.order_id = s.order_id
    JOIN customers c ON c.customer_id = o.customer_id
    GROUP BY customer
    ORDER BY total DESC
    LIMIT 10;
  `,
};

const inventoryReportQueries = {
  totalProducts: `
    SELECT COUNT(product_id) AS total_products
    FROM products;
  `,

  lowStockProducts: `
    SELECT name, stock_quantity AS stock
    FROM products
    WHERE stock_quantity <= 5 AND stock_quantity > 0
    ORDER BY stock_quantity ASC;
  `,

  outOfStockProducts: `
    SELECT name
    FROM products
    WHERE stock_quantity = 0;
  `,

  recentChanges: `
    SELECT
      name,
      stock_quantity AS newQty,
      updated_at::date AS updatedAt
    FROM products
    WHERE updated_at >= NOW() - INTERVAL '7 days'
    ORDER BY updated_at DESC
    LIMIT 10;
  `,

  returnedProducts: `
    SELECT
      p.name,
      sr.returned_quantity AS qty,
      sr.return_reason AS reason,
      sr.return_date::date AS date
    FROM sales_returns sr
    JOIN order_items oi ON sr.order_item_id = oi.order_item_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE sr.status = 'Completed'
    ORDER BY sr.return_date DESC
    LIMIT 10;
  `,

  inventoryMovement: `
    SELECT
      TO_CHAR(day, 'Mon DD') AS date,
      COALESCE(sales_sum, 0) AS sales,
      COALESCE(returns_sum, 0) AS returns
    FROM
      generate_series(
        CURRENT_DATE - INTERVAL '14 days',
        CURRENT_DATE,
        '1 day'
      ) AS day
    LEFT JOIN (
      SELECT
        sale_date::date AS sale_day,
        SUM(oi.quantity) AS sales_sum
      FROM sales s
      JOIN order_items oi ON s.order_id = oi.order_id
      GROUP BY sale_day
    ) sales_data ON day = sales_data.sale_day
    LEFT JOIN (
      SELECT
        return_date::date AS return_day,
        SUM(returned_quantity) AS returns_sum
      FROM sales_returns
      GROUP BY return_day
    ) returns_data ON day = returns_data.return_day
    ORDER BY day;
  `,
};

const profitAndLossReportQueries = {
  kpiStats: `
    WITH revenue_cte AS (
      SELECT COALESCE(SUM(total_amount), 0) AS revenue FROM sales
    ),
    cogs_cte AS (
      SELECT COALESCE(SUM(p.cost_price * oi.quantity), 0) AS cogs
      FROM order_items oi
      JOIN products p ON p.product_id = oi.product_id
    ),
    returns_cte AS (
      SELECT COALESCE(SUM(p.price * sr.returned_quantity), 0) AS returns
      FROM sales_returns sr
      JOIN order_items oi ON sr.order_item_id = oi.order_item_id
      JOIN products p ON oi.product_id = p.product_id
    )
    SELECT
      r.revenue,
      c.cogs,
      rt.returns,
      (r.revenue - c.cogs) AS gross_profit,
      (r.revenue - c.cogs - rt.returns) AS net_profit
    FROM revenue_cte r, cogs_cte c, returns_cte rt;
  `,

  monthlyBreakdown: `
    SELECT
      TO_CHAR(s.sale_date, 'Mon') AS month,
      DATE_TRUNC('month', s.sale_date) AS month_date,
      SUM(s.total_amount) AS revenue,
      SUM(p.cost_price * oi.quantity) AS cogs,
      COALESCE(SUM(p.price * sr.returned_quantity), 0) AS returns
    FROM sales s
    JOIN orders o ON o.order_id = s.order_id
    JOIN order_items oi ON oi.order_id = o.order_id
    JOIN products p ON p.product_id = oi.product_id
    LEFT JOIN sales_returns sr ON sr.order_item_id = oi.order_item_id
    GROUP BY month, month_date
    ORDER BY month_date;
  `,
};

const annualReportQueries = {
  totalSales: `
    SELECT COUNT(sale_id) AS total_sales FROM sales;
  `,

  totalOrders: `
    SELECT COUNT(order_id) AS total_orders FROM orders;
  `,

  totalRevenue: `
    SELECT COALESCE(SUM(total_amount), 0) AS total_revenue FROM sales;
  `,

  totalReturns: `
    SELECT COUNT(return_id) AS total_returns
    FROM sales_returns
    WHERE status = 'Completed';
  `,

  invoiceStats: `
    SELECT 
      COUNT(CASE WHEN status = 'paid' THEN 1 END) AS paid,
      COUNT(CASE WHEN status = 'unpaid' THEN 1 END) AS unpaid,
      COUNT(CASE WHEN status = 'partial' THEN 1 END) AS partial
    FROM invoices;
  `,

  monthlyRevenue: `
    SELECT 
      TO_CHAR(sale_date, 'Mon') AS month,
      SUM(total_amount) AS amount
    FROM sales
    GROUP BY EXTRACT(MONTH FROM sale_date), TO_CHAR(sale_date, 'Mon')
    ORDER BY EXTRACT(MONTH FROM sale_date);
  `,

  monthlyOrders: `
    SELECT 
      TO_CHAR(order_date, 'Mon') AS month,
      COUNT(order_id) AS count
    FROM orders
    GROUP BY EXTRACT(MONTH FROM order_date), TO_CHAR(order_date, 'Mon')
    ORDER BY EXTRACT(MONTH FROM order_date);
  `,

  categorySales: `
    SELECT 
      c.name,
      SUM(oi.price * oi.quantity) AS total
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    JOIN categories c ON p.category_id = c.category_id
    GROUP BY c.name
    ORDER BY total DESC;
  `,

  brandSales: `
    SELECT 
      b.name,
      SUM(oi.price * oi.quantity) AS total
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    JOIN brands b ON p.brand_id = b.brand_id
    GROUP BY b.name
    ORDER BY total DESC;
  `,
};

// Controller function
const getSalesReports = async (req, res) => {
  try {
    const [
      kpiStats,
      salesOverTime,
      topProducts,
      categorySales,
      salesReturns,
      monthlyRevenue,
      revenueByPaymentMethod,
      salesByCustomer,
    ] = await Promise.all([
      client.query(salesReturnReportQueries.kpiStats),
      client.query(salesReturnReportQueries.salesOverTime),
      client.query(salesReturnReportQueries.topProducts),
      client.query(salesReturnReportQueries.categorySales),
      client.query(salesReturnReportQueries.salesReturns),
      client.query(salesReturnReportQueries.monthlyRevenue),
      client.query(salesReturnReportQueries.revenueByPaymentMethod),
      client.query(salesReturnReportQueries.salesByCustomer),
    ]);

    const result = {
      kpiStats: kpiStats.rows[0],
      salesOverTime: salesOverTime.rows[0],
      topProducts: topProducts.rows[0],
      categorySales: categorySales.rows[0],
      salesReturns: salesReturns.rows[0],
      monthlyRevenue: monthlyRevenue.rows[0],
      revenueByPaymentMethod: revenueByPaymentMethod.rows[0],
      salesByCustomer: salesByCustomer.rows[0],
    };

    return res.status(200).json({ success: true, result: [result] });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getInventoryReports = async (req, res) => {
  try {
    const [
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      recentChanges,
      returnedProducts,
      inventoryMovement,
    ] = await Promise.all([
      client.query(inventoryReportQueries.totalProducts),
      client.query(inventoryReportQueries.lowStockProducts),
      client.query(inventoryReportQueries.outOfStockProducts),
      client.query(inventoryReportQueries.recentChanges),
      client.query(inventoryReportQueries.returnedProducts),
      client.query(inventoryReportQueries.inventoryMovement),
    ]);

    const result = {
      totalProducts: totalProducts.rows[0],
      lowStockProducts: lowStockProducts.rows,
      outOfStockProducts: outOfStockProducts.rows[0],
      recentChanges: recentChanges.rows,
      returnedProducts: returnedProducts.rows,
      inventoryMovement: inventoryMovement.rows,
    };

    return res.status(200).json({ success: true, result: [result] });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getProfitLossReport = async (req, res) => {
  try {
    const [kpiStats, monthlyBreakdown] = await Promise.all([
      client.query(profitAndLossReportQueries.kpiStats),
      client.query(profitAndLossReportQueries.monthlyBreakdown),
    ]);

    const result = {
      kpiStats: kpiStats.rows[0],
      monthlyBreakdown: monthlyBreakdown.rows,
    };

    return res.status(200).json({ success: true, result: [result] });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getAnnualReport = async (req, res) => {
  try {
    const [
      totalSales,
      totalOrders,
      totalRevenue,
      totalReturns,
      invoiceStats,
      monthlyRevenue,
      monthlyOrders,
      categorySales,
      brandSales,
    ] = await Promise.all([
      client.query(annualReportQueries.totalSales),
      client.query(annualReportQueries.totalOrders),
      client.query(annualReportQueries.totalRevenue),
      client.query(annualReportQueries.totalReturns),
      client.query(annualReportQueries.invoiceStats),
      client.query(annualReportQueries.monthlyRevenue),
      client.query(annualReportQueries.monthlyOrders),
      client.query(annualReportQueries.categorySales),
      client.query(annualReportQueries.brandSales),
    ]);

    const result = {
      totalSales: totalSales.rows[0].total_sales,
      totalOrders: totalOrders.rows[0].total_orders,
      totalRevenue: totalRevenue.rows[0].total_revenue,
      totalReturns: totalReturns.rows[0].total_returns,
      invoiceStats: {
        paid: invoiceStats.rows[0].paid,
        unpaid: invoiceStats.rows[0].unpaid,
        partial: invoiceStats.rows[0].partial,
      },
      monthlyRevenue: monthlyRevenue.rows,
      monthlyOrders: monthlyOrders.rows,
      categorySales: categorySales.rows,
      brandSales: brandSales.rows,
    };

    return res.status(200).json({ success: true, result: [result] });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export {
  getSalesReports,
  getInventoryReports,
  getProfitLossReport,
  getAnnualReport,
};
