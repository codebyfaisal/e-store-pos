import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";

import {
  DataTable,
  Filters,
  ConfirmModal,
  Loader,
} from "@/components/index.js";

import {
  useSortedData,
  useSortConfig,
  useFilteredData,
} from "@/hooks/index.js";
import normalizeDate from "@/utils/normalizeDate.js";
import { useApiDataStore } from "@/store/index.js";

const Products = () => {
  const [searchParams] = useSearchParams();
  const { fetchData, deleteData } = useApiDataStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { sortConfig, handleSort, getSortIcon } = useSortConfig("");

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [filters, setFilters] = useState({
    name: searchParams.get("name") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    minPrice:
      searchParams.get("min price") || searchParams.get("min-price") || "",
    maxPrice:
      searchParams.get("max price") || searchParams.get("max-price") || "",
    fromDate:
      normalizeDate(
        searchParams.get("from date") || searchParams.get("from-date"),
        "YYYY-MM-DD"
      ) || "",
    toDate:
      normalizeDate(
        searchParams.get("to date") || searchParams.get("to-date"),
        "YYYY-MM-DD"
      ) || "",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    const result = await fetchData("/api/products");
    if (result === null) {
      setLoading(false);
      return;
    }
    if (!result || result.length === 0) return;
    setData([...result]);
    setCategories([...new Set(result.map((product) => product.category))]);
    setBrands([...new Set(result.map((product) => product.brand))]);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [fetchData]);

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    await deleteData("/api/products/" + productToDelete.product_id);
    await getData();
    closeDeleteModal();
  };

  const filtered = useFilteredData(data, filters);
  const sortedProducts = useSortedData(filtered, sortConfig);

  const columns = [
    {
      key: "product_id",
      label: "#",
      span: 1,
    },
    {
      key: "product_name",
      label: "Name",
      span: 2,
    },
    {
      key: "brand",
      label: "Brand",
      span: 1,
    },
    {
      key: "category",
      label: "Category",
      span: 2,
    },
    {
      key: "price",
      label: "Price",
      span: 1,
      render: (item) => `$${Number(item.price).toFixed(2)}`,
    },
    {
      key: "stock_quantity",
      label: "Stock",
      span: 1,
    },
    {
      key: "created_at",
      label: "Created At",
      span: 2,
      render: (item) => new Date(item.created_at).toLocaleDateString(),
    },
  ];

  const renderActions = (item) => (
    <>
      <Link
        to={`/products/${item.product_id}`}
        className="btn btn-xs btn-ghost"
        title="Edit"
      >
        <Pencil size={16} />
      </Link>
      <button
        className="btn btn-xs btn-ghost text-error"
        title="Delete"
        onClick={() => openDeleteModal(item)}
      >
        <Trash2 size={16} />
      </button>
    </>
  );

  const filterComponents = {
    searchFields: [
      {
        key: "name",
        label: "Name",
        span: {
          sm: 6,
        },
      },
    ],
    dropdown: [
      {
        name: "Categories",
        field: "category",
        options: categories,
        span: {
          xs: 6,
          sm: 3,
        },
      },
      {
        name: "Brands",
        field: "brand",
        options: brands,
        span: {
          xs: 6,
          sm: 3,
        },
      },
    ],
    maxMin: {
      span: {
        sm: 3,
        md: 2,
      },
    },
    timeRange: {
      span: {
        xs: 6,
        sm: 3,
        lg: 2,
      },
    },
  };

  if (loading) return <Loader message="Loading..." />;
  if (data?.length === 0) return <div>No Products found</div>;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap justify-between gap-4 items-center">
        <h1 className="text-3xl font-bold mb-">Products</h1>
        <div className="flex gap-4 flex-wrap self-end">
          <button
            className="btn btn-ghost border border-base-300"
            onClick={() =>
              setFilters({
                name: "",
                category: "",
                brand: "",
                minPrice: "",
                maxPrice: "",
                fromDate: "",
                toDate: "",
              })
            }
          >
            Clear All
          </button>
          <Link to="/products/new" className="btn btn-primary">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Filters
        filters={filters}
        setFilters={setFilters}
        components={filterComponents}
      />

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Showing {sortedProducts.length} of {data.length} product(s)
        </span>
      </div>

      {/* Data Table or Grid */}
      <DataTable
        data={sortedProducts}
        sortHandlers={{ handleSort, getSortIcon }}
        renderActions={renderActions}
        columns={columns}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteProduct}
        title="Confirm Delete"
        message={
          <div className="text-center">
            Are you sure you want to delete the product?
            <br />
            <strong>{productToDelete?.name}</strong>
          </div>
        }
        confirmText="Yes, Delete"
        confirmBtnClass="btn-error"
        modalId="delete-product-modal"
      />
    </section>
  );
};

export default Products;
