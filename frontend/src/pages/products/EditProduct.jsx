import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "@/components/index.js";
import toast from "react-hot-toast";
import { useApiDataStore } from "@/store/index.js";

const initialForm = {
  name: "",
  category_id: "",
  brand_id: "",
  description: "",
  price: "",
  stock_quantity: "",
  buy_price: "",
};

const EditProduct = () => {
  const { id } = useParams();
  const { fetchData, updateData } = useApiDataStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadMeta = async () => {
    const result = await fetchData("/api/products/meta");
    if (result) {
      setBrands(result.brands || []);
      setCategories(result.categories || []);
    }
  };

  const loadProduct = async () => {
    const result = await fetchData(`/api/products/${id}`);
    if (!result) {
      toast.error("Failed to load product.");
      navigate("/products");
      return;
    }

    const data = {
      name: result.name || "",
      category_id: result.category_id?.toString() || "",
      brand_id: result.brand_id?.toString() || "",
      description: result.description || "",
      price: result.price || "",
      stock_quantity: result.stock_quantity?.toString() || "",
      buy_price: result.buy_price || "",
      product_id: result.product_id,
    };

    setFormData(data);
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await loadMeta();
      await loadProduct();
      setLoading(false);
    };
    fetchAll();
  }, [id]);

  const validateForm = () => {
    if (!formData.name.trim()) return "Product name is required.";
    if (!formData.category_id) return "Please select a category.";
    if (!formData.brand_id) return "Please select a brand.";
    if (!formData.price || Number(formData.price) <= 0)
      return "Price must be a positive number.";
    if (
      formData.stock_quantity === "" ||
      Number(formData.stock_quantity) < 0
    )
      return "Stock quantity must be 0 or more.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSaveLoading(true);
    try {
      await updateData(`/api/products`, formData);
      setTimeout(() => navigate("/products"), 1000);
      setFormData(initialForm);
    } catch (err) {
      toast.error(
        err?.response?.data?.error ||
          "Failed to update product. Try again later."
      );
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return <Loader message="Loading product..." />;
  if (brands.length === 0 || categories.length === 0)
    return <div>No Meta Data found</div>;

  return (
    <section className="mx-auto space-y-4">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8"
      >
        <div className="form-control col-span-2 sm:col-span-1">
          <label className="label">Product Name</label>
          <input
            type="text"
            name="name"
            className="input input-bordered w-full"
            placeholder="Laptop"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-control col-span-2 sm:col-span-1">
          <label className="label">Category</label>
          <select
            name="category_id"
            className="select select-bordered w-full"
            value={formData.category_id}
            onChange={handleChange}
            required
            disabled={saveLoading}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option
                key={cat.id || cat.category_id}
                value={cat.id || cat.category_id}
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control col-span-2 sm:col-span-1">
          <label className="label">Price ($)</label>
          <input
            type="number"
            name="price"
            step="0.01"
            className="input input-bordered w-full"
            placeholder="$ 99.99"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-control col-span-2 sm:col-span-1">
          <label className="label">Stock Quantity</label>
          <input
            type="number"
            name="stock_quantity"
            className="input input-bordered w-full"
            placeholder="10"
            value={formData.stock_quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-control col-span-2">
          <label className="label">Description</label>
          <textarea
            name="description"
            className="textarea textarea-bordered w-full"
            placeholder="Short product description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-control col-span-2 sm:col-span-1">
          <label className="label">Brand</label>
          <select
            name="brand_id"
            className="select select-bordered w-full"
            value={formData.brand_id}
            onChange={handleChange}
            required
            disabled={saveLoading}
          >
            <option value="">Select a brand</option>
            {brands.map((brand) => (
              <option key={brand.brand_id} value={brand.brand_id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control col-span-2 sm:col-span-1">
          <label className="label">Cost Price</label>
          <input
            type="number"
            name="buy_price"
            className="input input-bordered w-full"
            placeholder="$ 99.99"
            value={formData.buy_price}
            onChange={handleChange}
          />
        </div>

        <div className="form-control col-span-2 sm:col-span-1 md:col-span-2">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={saveLoading}
          >
            {saveLoading ? "Saving..." : "Update Product"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditProduct;
