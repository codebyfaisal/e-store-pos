import client from "../config/supabaseClient.config.js";

// GET /customers - Get all customers
const getCustomers = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT * FROM customers
      `);

    if (result.rows?.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No customers found" });
    }

    res.status(200).json({ success: true, result: result.rows });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch customers" });
  }
};

// GET /customers/:id - Get a single customer by ID
const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await client.query(`
      SELECT * FROM customers
      WHERE customer_id = ${id}
    `);

    if (!result || result.rows?.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Customer not found" });
    }

    res.status(200).json({ success: true, result: result.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch the customer" });
  }
};

// POST /customers - Create a new customer
const insertCustomer = async (req, res) => {
  try {
    const { first_name, last_name, email, phone } = req.body;

    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        success: false,
        error: "First name, last name, and email are required",
      });
    }

    const result = await client.query(`
      INSERT INTO customers (first_name, last_name, email, phone)
      VALUES (${first_name}, ${last_name}, ${email}, ${phone || null})
      RETURNING *
    `);

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        error: "Email already exists",
      });
    }

    res
      .status(500)
      .json({ success: false, error: "Failed to create customer" });
  }
};

// PUT /customers/:id - Update a customer
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone } = req.body;

    const result = await client.query(`
      UPDATE customers
      SET 
        first_name = ${first_name},
        last_name = ${last_name},
        email = ${email},
        phone = ${phone || null}
      WHERE customer_id = ${id}
      RETURNING *
    `);

    if (result.rows?.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Customer not found" });
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer: result[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        error: "Email already exists",
      });
    }

    res
      .status(500)
      .json({ success: false, error: "Failed to update customer" });
  }
};

// DELETE /customers/:id - Delete a customer
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await client.query(`
      UPDATE customers
      SET status = 'deleted'
      WHERE customer_id = ${id}
      RETURNING *
    `);

    if (result.rows?.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to delete customer" });
  }
};

export {
  getCustomers,
  getCustomer,
  insertCustomer,
  updateCustomer,
  deleteCustomer,
};
