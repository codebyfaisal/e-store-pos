import React, { useState } from "react";
import NoItemError from "@/components/ui/NoItemError";

const PAGE_SIZE = 9;

const DataTable = ({ data, sortHandlers, renderActions, columns }) => {
  const { handleSort, getSortIcon } = sortHandlers;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  const paginatedData = data.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (
    !data ||
    data.length === 0 ||
    columns.length === 0 ||
    !sortHandlers ||
    !renderActions
  )
    return null;    

  return (
    <div className="relative">
      <div className="overflow-x-auto relative">
        <table className="table table-zebra w-max lg:w-full">
          <thead>
            <tr className="grid grid-cols-11">
              {columns?.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="cursor-pointer"
                  style={{ gridColumn: `span ${col.span}` }}
                >
                  {col.label}
                  {getSortIcon(col.key)}
                </th>
              ))}
              <th className="col-span-1 text-center">Actions</th>
            </tr>
          </thead>
          <>
            {data?.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={columns.length}>
                    <NoItemError error="No items found" />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {paginatedData.map((item) => (
                  <tr
                    key={Math.random()}
                    className="grid grid-cols-11 transition-opacity duration-300"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{ gridColumn: `span ${col.span}` }}
                      >
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                    <td className="flex gap-2 col-span-1 justify-center">
                      {renderActions(item)}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            className={`btn btn-sm ${
              currentPage === idx + 1 ? "btn-primary" : ""
            }`}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
