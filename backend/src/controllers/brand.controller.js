import client from "../config/supabaseClient.config.js";
import { responseSuccess, responseError } from "../utils/response.utils.js";

const query = {
  getBrands: `
    SELECT 
      b.brand_id,
      b.name AS brand_name,
      CASE 
          WHEN COUNT(DISTINCT p.category_id) = 0 THEN '-' 
          ELSE COUNT(DISTINCT p.category_id)::text 
      END AS total_categories,
      COALESCE(ROUND(AVG(p.price), 2), 0.00) AS avg_price,
      COALESCE(SUM(p.stock_quantity), 0) AS total_stock
    FROM 
      products p
    RIGHT JOIN 
      brands b ON p.brand_id = b.brand_id
    GROUP BY 
      b.brand_id, b.name
    ORDER BY 
      total_categories DESC NULLS LAST;
  `,
  insertBrand: `
    INSERT INTO Brands (name) 
    VALUES ($1) RETURNING *`,

  updateBrand: `
    UPDATE Brands
    SET name = $1, updated_at = CURRENT_TIMESTAMP
    WHERE Brand_id = $2
    RETURNING *;`,

  deleteBrand: `
    DELETE FROM brands 
    WHERE brand_id = $1`,
}

// Get all Brands
const getBrands = async (req, res) => {
  try {
    const result = await client.query(query.getBrands);

    if (result.rows?.length === 0) {
      return responseError(res, 404, "No Brands found");
    }
    responseSuccess(res, 200, result.rows);
  } catch (error) {
    responseError(res, 500, "Failed to fetch Brands");
  }
};

const insertBrand = async (req, res) => {
  const { name: brand } = req.body;

  if (!brand)
    return responseError(res, 400, "All fields are required");

  try {
    const result = await client.query(
      query.insertBrand,
      [brand]
    );

    if (result.rows?.length === 0)
      return responseError(res, 500, "Failed to create new Brand");

    responseSuccess(res, 201, result.rows[0], "Brand created successfully");
  } catch (error) {
    if (error.code === "23505") {
      return responseError(res, 409, "Brand already exists");
    } else {
      responseError(res, 500, "Failed to create new Brand");
    }
  }
};

// Update an existing Brand by ID
const updateBrand = async (req, res) => {
  try {
    const { brand_id: brandId, name } = req.body;

    if (!brandId || !name)
      return responseError(res, 400, "All fields are required");

    const result = await client.query(query.updateBrand, [name, brandId]);

    if (result?.rows?.length === 0)
      return responseError(res, 404, "Brand not found");

    responseSuccess(res, 200, result.rows[0], "Brand updated successfully");
  } catch (error) {
    responseError(res, 500, "Failed to update the Brand");
  }
};

// Delete a Brand by ID
const deleteBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const brandQuery = await client.query(
      `SELECT b.name, b.brand_id, COUNT(p.product_id) AS product_count
       FROM brands b
       LEFT JOIN products p ON b.brand_id = p.brand_id
       WHERE b.brand_id = $1
       GROUP BY b.brand_id`,
      [id]
    );

    if (brandQuery.rowCount === 0)
      responseError(res, 404, "Brand not found");

    const { name: brandName, product_count } = brandQuery.rows[0];

    if (parseInt(product_count) > 0)
      return responseError(res, 400, `Cannot delete brand "${brandName}", when it is linked to products`);

    await client.query(query.deleteBrand, [id]);

    responseSuccess(res, 200, null, "Brand deleted successfully");
  } catch (error) {
    responseError(res, 500, "Failed to delete the brand");
  }
};

export { getBrands, insertBrand, updateBrand, deleteBrand };
