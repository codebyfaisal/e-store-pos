import client from "../config/supabaseClient.config.js";

// Get all Categories
const getCategories = async (req, res) => {
  try {
    const result = await client.query(`
        SELECT 
            c.category_id,
            c.name AS category_name,
            CASE 
                WHEN COUNT(DISTINCT p.brand_id) = 0 THEN '-'
                ELSE COUNT(DISTINCT p.brand_id)::text 
            END AS total_brands,
            COALESCE(ROUND(AVG(p.price), 2), 0.00) AS avg_price,
            COALESCE(SUM(p.stock_quantity), 0) AS total_stock
        FROM 
            products p
        RIGHT JOIN 
            categories c ON p.category_id = c.category_id
        GROUP BY 
            c.category_id, c.name
        ORDER BY 
            total_brands DESC NULLS LAST;
    `);

    if (result.rows?.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No Categories found" });
    }
    res.status(200).json({ success: true, result: result.rows });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch Categories" });
  }
};

// Insert/Create a new Category
const insertCategory = async (req, res) => {
  const { name: category } = req.body;

  if (!category)
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });

  try {
    const result = await client.query(
      `
      INSERT INTO Categories (name) 
      VALUES ($1) RETURNING *`,
      [category]
    );

    if (result.rows?.length === 0) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to create new Category" });
    }

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ success: false, error: "Category already exists" });
    } else {
      return res
        .status(500)
        .json({ success: false, error: "Failed to create new Category" });
    }
  }
};

// Update an existing Category by ID
const updateCategory = async (req, res) => {
  try {
    const { category_id, name } = req.body;

    const result = await client.query(
      `
      UPDATE Categories
      SET name = $1
      WHERE category_id = $2
      RETURNING *
    `,
      [name, category_id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update the Category",
    });
  }
};

// Delete a Category by ID
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const categoryQuery = await client.query(
      `SELECT c.name, c.category_id, COUNT(p.product_id) AS product_count
       FROM categories c
       LEFT JOIN products p ON c.category_id = p.category_id
       WHERE c.category_id = $1
       GROUP BY c.category_id`,
      [id]
    );

    if (categoryQuery.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    const { name: categoryName, product_count } = categoryQuery.rows[0];

    if (parseInt(product_count) > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete category with when it is linked to products",
      });
    }
    await client.query(
      `
      DELETE FROM categories
      WHERE category_id = $1`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to delete the category",
    });
  }
};

export { getCategories, insertCategory, updateCategory, deleteCategory };
