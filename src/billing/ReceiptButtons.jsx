import React from "react";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import generateThermalReceipt from "./generateThermalReceipt";
import generateA4Receipt from "./generateA4Receipt";

const ReceiptButtons = ({ bill, entries }) => {
    const handleThermal = () => {
        generateThermalReceipt(bill, entries);
    };

    const handleA4 = () => {
        generateA4Receipt(bill, entries);
    };

    return (
        <div className="flex gap-4 justify-end mt-4">
            <button
                onClick={handleThermal}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
                <FaPrint />
                80mm Receipt
            </button>
            <button
                onClick={handleA4}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
                <FaFilePdf />
                A4 Invoice
            </button>
        </div>
    );
};

export default ReceiptButtons;
