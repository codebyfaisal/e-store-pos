import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { useApiDataStore } from "@/store/index.js";

import {
  useFilteredData,
  useSortedData,
  useSortConfig,
  useCrudModals,
} from "@/hooks/index.js";

import { InputModal, ConfirmModal, DataTable } from "@/components/index.js";

const Brands = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("brand");

  const {
    fetchData,
    addData,
    updateData,
    deleteData,
    error: apiError,
  } = useApiDataStore();

  const [filterName, setFilterName] = useState(searchQuery || "");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);

  const { sortConfig, handleSort, getSortIcon } = useSortConfig("id");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    const result = await fetchData("/api/brands");
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

  const brands = Array.isArray(data)
    ? data.map((brand) => ({
        id: brand.brand_id,
        brand: brand.brand_name,
        categories: brand.total_categories,
        avgPrice: parseFloat(brand.avg_price),
        totalStock: parseInt(brand.total_stock),
      }))
    : [];

  const {
    modalOpen,
    modalMode,
    inputValue: brandInput,
    editingItem: editingBrand,
    error,
    setInputValue: setBrandInput,
    openAddModal,
    openEditModal,
    closeModal,
    validateAndSubmit,
    setError,
  } = useCrudModals({
    existingItems: brands,
    validateName: (name) =>
      !name.trim() ? "Brand name cannot be empty" : null,
  });

  const filteredBrands = useFilteredData(brands, { brand: filterName });
  const sortedBrands = useSortedData(filteredBrands, sortConfig);

  if (loading) return null;

  if (apiError) return <div>Error: {apiError}</div>;

  const handleAddBrand = async (name) => {
    if (!name) return;
    try {
      await addData("/api/brands", { name });
      toast.success("Brand added successfully!");
      getData();
      closeModal();
    } catch (error) {
      if (error.response?.status === 409) {
        setError("Brand name already exists");
        toast.error(
          <div>
            <strong className="block text-lg">Failed to add brand</strong>
            {`${error.response.data.error}`} <br />
          </div>
        );
      } else {
        toast.error(
          error?.response?.data?.error ||
            "Failed to add brand. Please try again later."
        );
      }
    }
  };

  const handleUpdateBrand = async (name) => {
    if (!name) return;
    const trimmedName = name.trim();
    if (!trimmedName) return setError("Brand name cannot be empty");

    const isDuplicate = brands.some(
      (brand) =>
        brand.brand.toLowerCase() === trimmedName.toLowerCase() &&
        brand.id !== editingBrand.id
    );

    if (isDuplicate) return setError("Brand name already exists");
    try {
      await updateData(`/api/brands`, {
        brand_id: editingBrand.id,
        name: trimmedName,
      });
      getData();
      closeModal();
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Failed to update brand. Please try again later."
      );
    }
  };

  const openDeleteModal = (brand) => {
    setBrandToDelete(brand);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setBrandToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDeleteBrand = async () => {
    if (!brandToDelete) return;
    try {
      await deleteData(`/api/brands/${brandToDelete.id}`);
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
      render: (brand) => brand.id,
    },
    {
      key: "brand",
      label: "Brand",
      span: 2,
      render: (brand) => brand.brand,
    },
    {
      key: "categories",
      label: "Categories",
      span: 2,
      render: (brand) => brand.categories || "-",
    },
    {
      key: "avgPrice",
      label: "Avg. Price",
      span: 2,
      render: (brand) => {
        const price = Number(brand?.avgPrice.toFixed(2));
        return !isNaN(price) ? `$ ${price}` : `$ 0.00`;
      },
    },
    {
      key: "totalStock",
      label: "Total Stock",
      span: 2,
      render: (brand) => brand?.totalStock || 0,
    },
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h1 className="text-3xl font-bold">Brands</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} /> Add Brand
        </button>
      </div>

      {/* Filter */}
      <input
        type="text"
        placeholder="Search brands..."
        className="input input-bordered w-full max-w-xs mb-4"
        value={filterName}
        onChange={(e) => setFilterName(e.target.value)}
      />

      {/* DataTable */}
      <DataTable
        data={sortedBrands}
        sortHandlers={{ handleSort, getSortIcon }}
        columns={columns}
        renderActions={(brand) => (
          <>
            <button
              className="btn btn-xs btn-ghost"
              title="Edit Brand"
              onClick={() => openEditModal({ name: brand.brand, id: brand.id })}
            >
              <Pencil size={16} />
            </button>
            <button
              className="btn btn-xs btn-ghost text-error"
              title="Delete Brand"
              onClick={() => openDeleteModal(brand)}
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
        modalId="brand-modal"
        title={modalMode === "add" ? "Add New Brand" : "Update Brand"}
        inputValue={brandInput}
        onInputChange={(e) => {
          setBrandInput(e.target.value);
          if (error) setError("");
        }}
        inputPlaceholder="Brand name"
        error={error}
        onSubmit={() => validateAndSubmit(handleAddBrand, handleUpdateBrand)}
        submitText={modalMode === "add" ? "Add" : "Update"}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            validateAndSubmit(handleAddBrand, handleUpdateBrand);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteBrand}
        title="Confirm Delete"
        message={
          <>
            Are you sure you want to delete the brand{" "}
            <strong>{brandToDelete?.brand}</strong>?
          </>
        }
        confirmText="Yes, Delete"
        confirmBtnClass="btn-error"
        modalId="delete-brand-modal"
      />
    </section>
  );
};

export default Brands;
