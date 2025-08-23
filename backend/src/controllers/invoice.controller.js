import puppeteer from "puppeteer";
import client from "../config/supabaseClient.config.js";
import { generateHTML } from "../utils/pdf-html.utils.js";
import { taxRate } from "../config/env.config.js";

const query = {
  invoices: `
    SELECT 
      i.invoice_id,
      i.paid_amount,
      i.status AS invoice_status,
      i.created_at,
      o.status AS order_status,
      c.first_name || ' ' || c.last_name AS customer_name
    FROM invoices i
    JOIN orders o ON i.order_id = o.order_id
    JOIN customers c ON o.customer_id = c.customer_id
    ORDER BY i.created_at DESC;
    `,

  invoiceDetails: `
      SELECT 
          i.invoice_id,
          i.issue_date,
          c.first_name || ' ' || c.last_name AS customer_name,
          c.phone AS customer_phone,
          CONCAT_WS(', ', os.street_address, os.city, os.state, os.postal_code, os.country) AS customer_address,
          json_agg(
              json_build_object(
                  'item_name', p.name,
                  'qty', oi.quantity,
                  'unit_price', oi.price
              )
          ) AS items
      FROM invoices i
      JOIN orders o ON i.order_id = o.order_id
      JOIN customers c ON o.customer_id = c.customer_id
      LEFT JOIN shipping_addresses os ON os.address_id = o.shipping_address_id
      JOIN order_items oi ON oi.order_id = o.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE i.invoice_id = $1
      GROUP BY i.invoice_id, i.issue_date, c.first_name, c.last_name, c.phone, os.street_address, os.city, os.state, os.postal_code, os.country;`,
};

// Get all Invoices
const getInvoices = async (req, res) => {
  try {
    const result = await client.query(query.invoices);

    if (result.rows?.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No invoices found" });
    }

    return res.status(200).json({ success: true, result: result.rows });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch Invoices" });
  }
};

const getInvoiceDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await client.query(query.invoiceDetails, [id]);

    if (result.rows?.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: `Invoice not found with ID: ${id}` });
    }

    return res.status(200).json({
      success: true,
      result: { ...result.rows[0], tax: taxRate },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch Invoice" });
  }
};

const getInvoicePdf = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await client.query(query.invoiceDetails, [id]);

    if (result.rows?.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: `Invoice not found with ID: ${id}` });
    }

    const html = generateHTML(result.rows[0]);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=invoice.pdf");

    res.end(pdfBuffer);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch Invoice" });
  }
};

export { getInvoices, getInvoiceDetails, getInvoicePdf };
