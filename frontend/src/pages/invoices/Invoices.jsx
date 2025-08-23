import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { View } from "lucide-react";

import { useApiDataStore } from "@/store/index.js";

import {
  useSortConfig,
  useSortedData,
  useFilteredData,
} from "@/hooks/index.js";

import { DataTable, Filters, Loader } from "@/components/index.js";
import normalizeDate from "@/utils/normalizeDate";

const Invoices = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { fetchData } = useApiDataStore();

  const [filters, setFilters] = useState({
    name:
      searchParams.get("customer name") ||
      searchParams.get("customer-name") ||
      "",
    invoice_status:
      searchParams.get("invoice status") ||
      searchParams.get("invoice-status") ||
      "",
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
    const result = await fetchData("/api/invoices");
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

  const invoices =
    Array.isArray(data) && data.length > 0 && data[0].invoice_id
      ? data.map((row) => ({
          ...row,
          name: row.customer_name,
          invoice_id: row.invoice_id,
          paid_amount: Number(row.paid_amount),
          created_at: new Date(row.created_at),
        }))
      : [];

  const { sortConfig, handleSort, getSortIcon } = useSortConfig("name");
  const filtered = useFilteredData(invoices, filters);
  const filteredInvoices = useSortedData(filtered, sortConfig);

  const columns = [
    {
      key: "invoice_id",
      label: "#",
      span: 1,
      render: (inv) => inv.invoice_id,
    },
    {
      key: "name",
      label: "Customer",
      span: 2,
      render: (inv) => inv.name,
    },
    {
      key: "paid_amount",
      label: "Paid Amount",
      span: 2,
      render: (inv) => `$${inv.paid_amount}`,
    },
    {
      key: "order_status",
      label: "Order Status",
      span: 2,
      render: (inv) => inv.order_status,
    },
    {
      key: "invoice_status",
      label: "Inv Status",
      span: 2,
      render: (inv) =>
        inv.invoice_status === "paid" ? (
          <span className="bg-success py-1 px-3 rounded-md">
            {inv.invoice_status}
          </span>
        ) : (
          <span className="bg-error py-1 px-3 rounded-md">
            {inv.invoice_status}
          </span>
        ),
    },
    {
      key: "created_at",
      label: "Created At",
      span: 1,
      render: (inv) => new Date(inv.created_at).toLocaleDateString("en-US"),
    },
  ];

  const filterComponents = {
    searchFields: [{ key: "name", label: "Name", span: 3 }],
    dropdown: [
      {
        name: "Invoices Status",
        field: "invoice_status",
        options: ["unpaid", "paid"],
        span: 2,
      },
    ],
    timeRange: {
      span: 2,
    },
  };

  if (loading) return <Loader message="Loading..." />;
  if (filteredInvoices?.length === 0) return <div>No Invoices found</div>;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between gap-4 items-center">
        <h1 className="text-3xl font-bold mb-6">Invoices</h1>
        <div className="flex gap-4 flex-wrap self-end">
          <button
            className="btn btn-ghost border border-base-300"
            onClick={() =>
              setFilters({ customer: "", status: "", fromDate: "", toDate: "" })
            }
          >
            Clear All
          </button>
        </div>
      </div>
      {/* Filters */}
      <Filters
        filters={filters}
        setFilters={setFilters}
        components={filterComponents}
      />

      {/* Layout Switch */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Showing {filteredInvoices.length} in {invoices.length} invoice(s)
        </span>
      </div>

      {/* Invoice Display */}
      <DataTable
        data={filteredInvoices}
        columns={columns}
        sortHandlers={{ handleSort, getSortIcon }}
        renderActions={(inv) => (
          <>
            <button
              className="btn btn-xs btn-ghost"
              onClick={() => navigate(`/invoices/${inv.invoice_id}`)}
            >
              <View size={16} />
            </button>
          </>
        )}
      />
    </section>
  );
};

export default Invoices;
