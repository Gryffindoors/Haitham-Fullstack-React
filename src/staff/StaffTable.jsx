// src/components/staff/StaffTable.jsx

import { useState } from "react";
import { deleteStaff } from "../api/staff/staff";
import StaffModal from "./StaffModal";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useStaff } from "../context/StaffContext";

const StaffTable = () => {
  const { staff, departments, refreshStaff } = useStaff();
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { role } = useAuth();
  const isOwner = role === "owner";

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteStaff(id);
      toast.success("✅ Deleted successfully");
      refreshStaff();
    } catch (err) {
      toast.error("❌ Failed to delete staff");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Staff Management</h2>
        <button
          onClick={() => {
            setSelected(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Staff
        </button>
      </div>

      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Image</th>
            <th className="p-2">Name</th>
            <th className="p-2">Department</th>
            <th className="p-2">Username</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">
                <img
                  src={s.image_url}
                  alt="staff"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td className="p-2">{s.first_name} {s.last_name}</td>
              <td className="p-2">{s.department?.name || "-"}</td>
              <td className="p-2">{s.username}</td>
              <td className="p-2 space-x-2">
                {isOwner ? (
                  <>
                    <button
                      onClick={() => {
                        setSelected(s);
                        setModalOpen(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400 italic">View only</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <StaffModal
          initialData={selected}
          departments={departments}
          onClose={() => setModalOpen(false)}
          onSaved={refreshStaff}
        />
      )}
    </div>
  );
};

export default StaffTable;
