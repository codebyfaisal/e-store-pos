import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import {
  useFilteredData,
  useSortedData,
  useSortConfig,
  useCrudModals,
} from "@/hooks/index.js";

import { useApiDataStore } from "@/store/index.js";
import { InputModal, ConfirmModal, DataTable } from "@/components/index.js";

const Categories = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("category");

  const {
    fetchData,
    addData,
    updateData,
    deleteData,
    error: apiError,
  } = useApiDataStore();
  const { sortConfig, handleSort, getSortIcon } = useSortConfig("id");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [filterName, setFilterName] = useState(searchQuery || " ");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    const result = await fetchData("/api/categories");
    if (result === null) {
      setLoading(false);
      return;
    }
    if (!result || result.length === 0) return;
    setData([...result]);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [fetchData]);

  const categories =
    Array.isArray(data) && data.length
      ? data.map((category) => ({
          id: category.category_id,
          category: category.category_name,
          productsCount: category.total_products,
          avgPrice: parseFloat(category.avg_price),
          totalStock: parseInt(category.total_stock),
        }))
      : [];

  const filteredCategories = useFilteredData(categories, {
    category: filterName,
  });
  const sortedCategories = useSortedData(filteredCategories, sortConfig);

  const {
    modalOpen,
    modalMode,
    inputValue: categoryInput,
    editingItem: editingCategory,
    error,
    setInputValue: setCategoryInput,
    openAddModal,
    openEditModal,
    closeModal,
    validateAndSubmit,
    setError,
  } = useCrudModals({
    existingItems: categories,
    validateName: (name) =>
      !name.trim() ? "Category name cannot be empty" : null,
  });

  if (loading) return <div>Loading...</div>;

  if (apiError) return <div>Error: {apiError}</div>;

  const handleAddCategory = async (name) => {
    if (!name) return;

    try {
      await addData("/api/categories", { name });
      toast.success("Category added successfully!");
      getData();
      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateCategory = async (name) => {
    if (!name) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Category name cannot be empty");
      return;
    }

    const isDuplicate = categories.some(
      (category) =>
        category.category.toLowerCase() === trimmedName.toLowerCase() &&
        category.id !== editingCategory.id
    );

    if (isDuplicate) {
      setError("Category name already exists");
      return;
    }

    try {
      await updateData("/api/categories", {
        category_id: editingCategory.id,
        name: trimmedName,
      });
      toast.success("Category updated successfully!");
      getData();
      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setCategoryToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteData(`/api/categories/${categoryToDelete.id}`);
      getData();
    } finally {
      closeDeleteModal();
    }
  };

  const columns = [
    {
      key: "id",
      label: "#",
      span: 1,
      render: (category) => category.id,
    },
    {
      key: "category",
      label: "Category",
      span: 2,
      render: (category) => category.category,
    },
    {
      key: "productsCount",
      label: "Products Count",
      span: 2,
      render: (category) => category.productsCount || 0,
    },
    {
      key: "avgPrice",
      label: "Avg. Price",
      span: 2,
      render: (category) => `$${category.avgPrice.toFixed(2)}`,
    },
    {
      key: "totalStock",
      label: "Total Stock",
      span: 2,
      render: (category) => category.totalStock || 0,
    },
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h1 className="text-3xl font-bold">Categories</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Filter */}
      <input
        type="text"
        placeholder="Search categories..."
        className="input input-bordered w-full max-w-xs mb-4"
        value={filterName || ""}
        onChange={(e) => setFilterName(e.target.value)}
      />

      {/* DataTable */}
      <DataTable
        data={sortedCategories}
        sortHandlers={{ handleSort, getSortIcon }}
        columns={columns}
        renderActions={(category) => (
          <>
            <button
              className="btn btn-xs btn-ghost"
              title="Edit Category"
              onClick={() =>
                openEditModal({ name: category.category, id: category.id })
              }
            >
              <Pencil size={16} />
            </button>
            <button
              className="btn btn-xs btn-ghost text-error"
              title="Delete Category"
              onClick={() => openDeleteModal(category)}
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      />

      {/* Add/Edit Modal */}
      <InputModal
        isOpen={modalOpen}
        onClose={closeModal}
        modalId="category-modal"
        title={modalMode === "add" ? "Add New Category" : "Update Category"}
        inputValue={categoryInput}
        onInputChange={(e) => {
          setCategoryInput(e.target.value);
          if (error) setError("");
        }}
        inputPlaceholder="Category name"
        error={error}
        onSubmit={() =>
          validateAndSubmit(handleAddCategory, handleUpdateCategory)
        }
        submitText={modalMode === "add" ? "Add" : "Update"}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            validateAndSubmit(handleAddCategory, handleUpdateCategory);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteCategory}
        title="Confirm Delete"
        message={
          <>
            Are you sure you want to delete the category{" "}
            <strong>{categoryToDelete?.category}</strong>?
          </>
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </section>
  );
};

export default Categories;
