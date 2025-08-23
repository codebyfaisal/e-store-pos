import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import { useApiDataStore } from "@/store/index.js";

import {
  DataTable,
  ConfirmModal,
  Filters,
  Loader,
} from "@/components/index.js";
import {
  useSortedData,
  useSortConfig,
  useFilteredData,
} from "@/hooks/index.js";
import normalizeDate from "@/utils/normalizeDate";

const Customers = () => {
  const [searchParams] = useSearchParams();
  const { fetchData, deleteData } = useApiDataStore();

  const [filters, setFilters] = useState({
    name: searchParams.get("name") || "",
    email: searchParams.get("email") || "",
    phone: searchParams.get("phone") || "",
    country: searchParams.get("country") || "",
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

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    const result = await fetchData("/api/customers");
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

  const customers = Array.isArray(data)
    ? data.map((cust) => ({
        ...cust,
        name: `${cust.first_name} ${cust.last_name}`,
      }))
    : [];

  const countries = [
    ...new Set(customers.map((cust) => cust.country).filter(Boolean)),
  ];

  const { sortConfig, handleSort, getSortIcon } = useSortConfig("created_at");
  const filtered = useFilteredData(customers, filters);
  const sortedCustomers = useSortedData(filtered, sortConfig);

  const openDeleteModal = (customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setCustomerToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    try {
      await deleteData(`/api/customers/${customerToDelete.customer_id}`);
      toast.success("Customer deleted successfully!");
      getData();
    } catch (err) {
      toast.error("Error deleting customer.");
    } finally {
      closeDeleteModal();
    }
  };

  const columns = [
    {
      key: "customer_id",
      label: "#",
      span: 1,
    },
    {
      key: "name",
      label: "Name",
      span: 1,
    },
    {
      key: "email",
      label: "Email",
      span: 3,
    },
    {
      key: "phone",
      label: "Phone",
      span: 2,
    },
    {
      key: "country",
      label: "Country",
      span: 1,
    },
    {
      key: "created_at",
      label: "Created At",
      span: 1,
      render: (item) => new Date(item.created_at).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      span: 1,
      render: (item) =>
        item.status === "active" ? (
          <span className="bg-success py-1 px-3 rounded-md">{item.status}</span>
        ) : (
          <span className="bg-error py-1 px-3 rounded-md">{item.status}</span>
        ),
    },
  ];

  const renderActions = (item) => (
    <button
      className="btn btn-xs btn-ghost text-error"
      title="Delete"
      onClick={() => openDeleteModal(item)}
    >
      <Trash2 size={16} />
    </button>
  );

  const filterComponents = {
    searchFields: [
      { key: "name", label: "Name", span: 2 },
      { key: "email", label: "Email", span: 2 },
      { key: "phone", label: "Phone", span: 2 },
    ],
    dropdown: [
      {
        name: "Country",
        field: "country",
        options: countries,
        span: 2,
      },
    ],
    timeRange: {
      span: 2,
    },
    maxMin: {
      span: 1,
    },
  };

  if (loading) return <Loader message="Loading..." />;
  if (sortedCustomers?.length === 0) return <div>No Customers found</div>;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Customers</h1>
        <button
          className="btn btn-ghost border border-base-300"
          onClick={() =>
            setFilters({
              name: "",
              email: "",
              phone: "",
              country: "",
              fromDate: "",
              toDate: "",
            })
          }
        >
          Clear All
        </button>
      </div>

      {/* Filters Section */}
      <Filters
        filters={filters}
        setFilters={setFilters}
        components={filterComponents}
      />

      <div className="text-sm text-gray-500">
        Showing {sortedCustomers.length} of {customers.length} customer(s)
      </div>

      <DataTable
        data={sortedCustomers}
        sortHandlers={{ handleSort, getSortIcon }}
        columns={columns}
        renderActions={renderActions}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteCustomer}
        title="Confirm Delete"
        message={
          <div>
            Are you sure you want to delete{" "}
            <strong>{customerToDelete?.name}</strong>?
          </div>
        }
        confirmText="Yes, Delete"
        confirmBtnClass="btn-error"
        modalId="delete-customer-modal"
      />
    </section>
  );
};

export default Customers;
