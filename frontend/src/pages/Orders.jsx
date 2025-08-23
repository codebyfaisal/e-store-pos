import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useApiDataStore } from "@/store/index.js";

import {
  useFilteredData,
  useSortConfig,
  useSortedData,
} from "@/hooks/index.js";
import { DataTable, ConfirmModal, Filters } from "@/components/index.js";

import normalizeDate from "@/utils/normalizeDate";

const Orders = () => {
  const [searchParams] = useSearchParams();

  const { fetchData, updateData, error } = useApiDataStore();

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filters, setFilters] = useState({
    customer_name: searchParams.get("name") || "",
    status: searchParams.get("status") || "",
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
    const result = await fetchData("/api/orders");
    if (!result || result.length === 0) return;
    setData([...result]);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [fetchData]);

  const orders = Array.isArray(data)
    ? data.map((o) => ({
        ...o,
        order_id: Number(o.order_id),
        total_amount: Number(o.total_amount),
        created_at: new Date(o.order_date),
      }))
    : [];

  const { sortConfig, handleSort, getSortIcon } = useSortConfig("");
  const filtered = useFilteredData(orders, filters);
  const sortedOrders = useSortedData(filtered, sortConfig);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  const handleStatusChange = (order, newStatus) => {
    setSelectedOrder(order);
    setSelectedStatus(newStatus);
    setStatusModalOpen(true);
  };
  const updateStatusChange = async () => {
    if (!selectedOrder) return;

    try {
      await updateData(`/api/orders`, {
        id: selectedOrder.order_id,
        status:
          selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1),
      });

      toast.success("Order status updated!");
      getData();
    } catch (error) {
      toast.error("Error updating order status");
    } finally {
      setStatusModalOpen(false);
      setSelectedOrder(null);
      setSelectedStatus("");
    }
  };

  const orderStatusOptions = [
    "order placed",
    "processing",
    "shipped",
    "delivered",
    "completed",
    "cancelled",
  ];

  const columns = [
    { key: "order_id", label: "#", span: 1 },
    { key: "customer_name", label: "Customer", span: 2 },
    {
      key: "total_amount",
      label: "Total",
      span: 1,
      render: (item) => `$${item.total_amount.toFixed(2)}`,
    },
    { key: "status", label: "Status", span: 2 },
    {
      key: "created_at",
      label: "Date",
      span: 2,
      render: (item) => item.created_at.toLocaleDateString(),
    },
  ];

  const filterComponents = {
    searchFields: [
      {
        key: "customer_name",
        label: "Name",
        span: {
          sm: 8,
        },
      },
    ],
    dropdown: [
      {
        name: "status",
        field: "status",
        options: orderStatusOptions,
        span: {
          sm: 2,
          md: 2,
        },
      },
    ],
    maxMin: {
      span: {
        xs: 3,
        sm: 1,
      },
    },
    timeRange: {
      span: {
        xs: 6,
        sm: 2,
      },
    },
  };

  const renderActions = (item) => (
    <select
      className="select select-sm select-bordered w-max"
      value={item.status}
      onChange={(e) => handleStatusChange(item, e.target.value)}
    >
      {orderStatusOptions.map((status) => (
        <option key={status} value={status} className="capitalize">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </option>
      ))}
    </select>
  );
  if (loading) return null;
  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>

        <button
          className="btn btn-ghost border border-base-300"
          onClick={() =>
            setFilters({
              name: "",
              status: "",
              minPrice: "",
              maxPrice: "",
              fromDate: "",
              toDate: "",
            })
          }
        >
          Clear All
        </button>
      </div>

      <Filters
        filters={filters}
        setFilters={setFilters}
        components={filterComponents}
      />

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Showing {sortedOrders.length} of {orders.length} orders
        </span>
      </div>

      <DataTable
        data={sortedOrders}
        sortHandlers={{ handleSort, getSortIcon }}
        renderActions={renderActions}
        columns={columns}
      />

      <ConfirmModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onConfirm={updateStatusChange}
        title="Confirm Status Change"
        message={
          <>
            Are you sure you want to change the status of order{" "}
            <strong>#{selectedOrder?.order_id}</strong> to{" "}
            <strong>{selectedStatus}</strong>?
          </>
        }
        confirmText="Yes, Change"
        confirmBtnClass="btn-primary"
        modalId="change-order-status-modal"
      />
    </section>
  );
};

export default Orders;
