import React, { useState, useEffect } from "react";
import TableBlock from "./TableBlock";
import AssignTableModal from "./AssignTableModal";
import FormattedText from "../utils/FormattedText";
import { getTableMap, assignTable } from "../api/tables/tables";
import toast from "react-hot-toast";


const indoor = Array.from({ length: 10 }, (_, i) => `A${i + 1}`);
const outdoor = Array.from({ length: 10 }, (_, i) => `A${i + 11}`);

export default function Floor1View() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableStates, setTableStates] = useState({});
  const reservedNumbers = Object.values(tableStates)
    .map((t) => t.assigned_table)
    .filter((n) => !!n && n !== "");


  // Fetch real table data
  useEffect(() => {
    const loadTables = async () => {
      try {
        const data = await getTableMap();
        const floor1Tables = data.filter((row) =>
          row.location_code?.startsWith("A")
        );
        const mapped = {};
        floor1Tables.forEach((row) => {
          mapped[row.location_code] = {
            status: row.status?.toLowerCase?.() || "empty",
            assigned_table: row.table_number || "",
          };
        });
        setTableStates(mapped);
      } catch (err) {
        console.error("Failed to load table data", err);
      }
    };

    loadTables();
  }, []);

  // On modal save → update API + local state
  const handleSave = async ({ code, status, assigned_table }) => {
    try {
      const payload = {
        location_code: code,
        ...(status && { status }),
        ...(assigned_table && { table_number: assigned_table }),
      };
      await assignTable(payload);
      setTableStates((prev) => ({
        ...prev,
        [code]: { status, assigned_table },
      }));
      toast.success(`Table ${code} updated`);
    } catch (err) {
      console.error("Failed to assign table", err);
      toast.error("Failed to update table");
    }
  };


  return (
    <div className="bg-none rounded-xl p-4 w-full shadow space-y-6">
      <h2 className="text-xl font-bold">
        <FormattedText capitalizeText id="floor_1" />
      </h2>

      <div className="bg-gray-200 text-center py-4 font-bold rounded">
        <FormattedText capitalizeText id="food_prep_area" />
      </div>

      <div>
        <h3 className="font-semibold mb-2">
          <FormattedText capitalizeText id="indoor_tables" />
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {indoor.map((code) => (
            <TableBlock
              key={code}
              code={code}
              status={tableStates[code]?.status || "empty"}
              assignedTable={tableStates[code]?.assigned_table || ""}
              onClick={() => setSelectedTable(code)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mt-4 mb-2">
          <FormattedText capitalizeText id="outdoor_tables" />
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {outdoor.map((code) => (
            <TableBlock
              key={code}
              code={code}
              status={tableStates[code]?.status || "empty"}
              assignedTable={tableStates[code]?.assigned_table || ""}
              onClick={() => setSelectedTable(code)}
            />
          ))}
        </div>
      </div>

      {selectedTable && (
        <AssignTableModal
          tableCode={selectedTable}
          onClose={() => setSelectedTable(null)}
          onSave={handleSave}
          reservedNumbers={reservedNumbers}
        />
      )}
    </div>
  );
}
