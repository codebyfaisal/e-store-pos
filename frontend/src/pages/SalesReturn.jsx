import React, { useState, useEffect } from "react";
import { useApiDataStore } from "@/store/index.js";
import {
  useFilteredData,
  useSortedData,
  useSortConfig,
} from "@/hooks/index.js";
import { NoItemError } from "@/components/index.js";

const SalesReturns = () => {
  const { fetchData, error } = useApiDataStore();
  const [filters, setFilters] = useState({ name: "" });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      const result = await fetchData("/api/sales-returns");
      if (!result || result.length === 0) return;
      setData([...result]);
      setLoading(false);
    };
    getData();
  }, [fetchData]);
  const returns = Array.isArray(data)
    ? data.map((sl) => ({
        ...sl,
        return_id: Number(sl.return_id),
        total_payment: Number(sl.total_payment),
        return_date: new Date(sl.return_date),
      }))
    : [];

  const { sortConfig, handleSort, getSortIcon } = useSortConfig("id");

  const filteredReturns = useFilteredData(returns, {
    product_name: filters.name,
  });
  const sortedReturns = useSortedData(filteredReturns, sortConfig);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Sales Returns</h1>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap justify-between">
        <input
          type="text"
          placeholder="Search by product name"
          className="input input-bordered w-full max-w-xs text-sm"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <button
          className="btn btn-ghost border border-base-300"
          onClick={() => setFilters({ name: "" })}
        >
          Clear
        </button>
      </div>

      {/* Table with accordion */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("product_name")}
              >
                Product{" "}
                <span className="text-sm">{getSortIcon("product_name")}</span>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("sold_quantity")}
              >
                Return Qty{" "}
                <span className="text-sm">{getSortIcon("sold_quantity")}</span>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("total_payment")}
              >
                Refund{" "}
                <span className="text-sm">{getSortIcon("total_payment")}</span>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status
                <span className="text-sm">{getSortIcon("status")}</span>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("return_date")}
              >
                Return Date
                <span className="text-sm">{getSortIcon("return_date")}</span>
              </th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {sortedReturns.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  <NoItemError error="No sales returns found." />
                </td>
              </tr>
            )}
            {sortedReturns.map((r, i) => (
              <React.Fragment key={i}>
                <tr
                  className={`border-t-1 border-primary/10 border-b-0 bg-base-100 ${
                    i % 2 === 0 ? "bg-base-200" : ""
                  }`}
                >
                  <td>{r.return_id}</td>
                  <td>{r.product_name}</td>
                  <td>{r.sold_quantity}</td>
                  <td>${r.total_payment}</td>
                  <td>{r.status}</td>
                  <td>{new Date(r.return_date).toLocaleDateString()}</td>
                  <td>
                    <label
                      htmlFor={`return-${r.return_id}`}
                      className="btn btn-xs btn-outline"
                    >
                      View
                    </label>
                  </td>
                </tr>

                <tr
                  className={`p-0 m-0 border-0 bg-base-100 ${
                    i % 2 === 0 ? "bg-base-200" : ""
                  }`}
                >
                  <td colSpan="6" className="p-0 m-0">
                    <div className="collapse collapse-arrow shadow-none">
                      <input
                        type="checkbox"
                        id={`return-${r.return_id}`}
                        className="absolute w-0"
                      />
                      <div className="collapse-content text-sm p-4 space-y-2">
                        <div>
                          <strong>Customer:</strong> {r.customer_name}
                        </div>
                        <div>
                          <strong>Sold Quantity:</strong> {r.sold_quantity}
                        </div>
                        <div>
                          <strong>Total Payment:</strong> ${r.sale_total_amount}
                        </div>
                        <div>
                          <strong>Return Reason:</strong> {r.return_reason}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SalesReturns;
