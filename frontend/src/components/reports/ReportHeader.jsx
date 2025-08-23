import React, { useState } from "react";
import { ReportFilters } from "@/components/index.js";
const ReportHeader = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);

  document.body.addEventListener("click", (e) => {
    const clickedInsideFilters = e.target.closest("#report-filters") !== null;
    const clickedOnBtn = e.target.closest("#report-filters-btn") !== null;

    if (!clickedInsideFilters && !clickedOnBtn) {
      setIsOpen(false);
    }
  });

  return (
    <div className="flex justify-between gap-4 relative">
      <h1 className="text-3xl font-bold">{title}</h1>

      <div
        className={`absolute top-full right-0 max-w-md translate-y-4 ${
          isOpen ? "block" : "hidden"
        }`}
        style={{ zIndex: 1000 }}
      >
        <ReportFilters id="report-filters" />
      </div>

      <div className="flex items-end gap-2">
        <button className="btn" onClick={handleToggle} id="report-filters-btn">
          Show Filters
        </button>
        <button className="btn btn-primary">📤 Export Report</button>
      </div>
    </div>
  );
};

export default ReportHeader;
