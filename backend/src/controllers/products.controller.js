import client from "../config/supabaseClient.config.js";

// Get all products
const getProducts = async (req, res) => {
  try {
    const result = await client.query(`
        SELECT
          p.product_id,
          p.name AS product_name,
          p.description,
          p.price,
          p.stock_quantity,
          c.name AS category,
          b.name AS brand,
          p.created_at,
          p.updated_at
        FROM products p
        JOIN brands b ON p.brand_id = b.brand_id
        JOIN categories c ON p.category_id = c.category_id
        ORDER BY product_id DESC;`);

    if (result.rows === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No products found" });
    }
    res.status(200).json({ success: true, result: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch products" });
  }
};

// Get a single product by ID
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.query(`
      SELECT * FROM products
      WHERE product_id = ${id}
      `);
    if (!result || result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No product found" });
    }
    res.status(200).json({ success: true, result: result.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch the product" });
  }
};

// Insert/Create a new product
const insertProduct = async (req, res) => {
  try {
    const { name, price, category_id, brand_id, stock_quantity, cost_price, description } =
      req.body;

    if (
      !name ||
      !price ||
      !category_id ||
      !brand_id ||
      !stock_quantity ||
      !cost_price ||
      !description
    ) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    const insertQuery = `
      INSERT INTO products (name, price, category_id, brand_id, stock_quantity, buy_price, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING product_id;
    `;

    const values = [
      name,
      price,
      category_id,
      brand_id,
      stock_quantity,
      cost_price,
      description,
    ];

    const result = await client.query(insertQuery, values);

    const productId = result.rows[0]?.product_id;

    if (!productId) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to retrieve new product ID" });
    }

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      productId,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to create new product" });
  }
};

// Update an existing product by ID
const updateProduct = async (req, res) => {
  try {
    const { product_id, name, category_id, brand_id, description, price, stock_quantity, buy_price } = req.body;

    if (!product_id) {
      return res
        .status(400)
        .json({ success: false, error: "Product ID is required" });
    }

    if (!name || !category_id || !brand_id || !description || !price || !stock_quantity || !buy_price)
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });

    const query = `
      UPDATE products
      SET name = $1, category_id = $2, brand_id = $3, description = $4, price = $5, stock_quantity = $6, buy_price = $7
      WHERE product_id = $8
      RETURNING *
    `;

    const values = [
      name,
      category_id,
      brand_id,
      description,
      price,
      stock_quantity,
      buy_price,
      product_id,
    ];


    const result = await client.query(query, values);

    if (result.rows?.length === 0)
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: result[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to update the product",
    });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const value = [id];
    const query = `
      DELETE FROM products
      WHERE product_id = $1
      RETURNING *
    `;

    const result = await client.query(query, value);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        error: "Product cannot be deleted as it is linked to existing orders.",
      });
    }
    return res.status(500).json({
      success: false,
      error: "Failed to delete the product",
    });
  }
};

// Get products meta result
const getProductMeta = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT brand_id, name FROM brands;
      SELECT category_id, name FROM categories;
    `);

    const brands = result[0].rows;
    const categories = result[1].rows;

    if (brands.length === 0 || categories.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No Meta data found" });
    }

    res.status(200).json({ success: true, result: { brands, categories } });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch Meta data`" });
  }
};

export {
  getProducts,
  getProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
  getProductMeta,
};
