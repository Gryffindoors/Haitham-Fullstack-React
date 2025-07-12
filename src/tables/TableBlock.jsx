// components/TableBlock.jsx
import React from "react";
import classNames from "classnames";

const statusColors = {
  empty: "bg-green-400",
  reserved: "bg-yellow-400",
  occupied: "bg-red-500",
  out_of_order: "bg-gray-600",
  needs_clearing: "bg-orange-400",
};

export default function TableBlock({ code, status, onClick, assignedTable }) {
  return (
    <div
      className={classNames(
        "rounded-xl px-2 py-3 text-sm font-bold cursor-pointer shadow-md hover:scale-105 transition-all text-white relative",
        statusColors[status] || "bg-gray-200"
      )}
      onClick={onClick}
    >
      <div className="text-sm text-center">{code}</div>
      {assignedTable && (
        <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-white text-gray-800 text-xs rounded-full px-2 py-0.5 shadow">
          #{assignedTable}
        </div>
      )}

+    </div >
  );
}

