import jsPDF from "jspdf";
import { toast } from "react-hot-toast";


const delayedRedirectToBills = () => {
    toast.info("Done, back to page");
    setTimeout(() => {
        window.location.href = "/bills";
    }, 1500); // gives time to click "Print" or "Download"
};


const generateA4Receipt = (bill, entries) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    let y = 20;

    // Title
    doc.setFontSize(18);
    doc.text("Le Monde Café", 105, y, { align: "center" });
    y += 10;

    doc.setFontSize(11);
    doc.text(`Invoice #${bill.id}`, 20, y);
    doc.text(`Date: ${new Date().toLocaleString("en-EG")}`, 150, y);
    y += 10;

    // Section: Items Table
    doc.setFontSize(12);
    doc.text("Items", 20, y);
    y += 6;

    doc.setFontSize(10);
    doc.text("Item", 20, y);
    doc.text("Qty", 100, y);
    doc.text("Unit Price", 130, y);
    doc.text("Total", 170, y);
    y += 4;

    doc.setDrawColor(200);
    doc.line(20, y, 190, y);
    y += 2;

    bill.items?.forEach((item) => {
        const name = item.name || item.item_name || "Item";
        const qty = item.quantity || 1;
        const price = item.price || 0;
        const total = qty * price;

        doc.text(name, 20, y);
        doc.text(`${qty}`, 100, y, { align: "right" });
        doc.text(`${price.toFixed(2)} EGP`, 130, y, { align: "right" });
        doc.text(`${total.toFixed(2)} EGP`, 170, y, { align: "right" });
        y += 6;
    });

    y += 4;
    doc.line(20, y, 190, y);
    y += 8;

    // Totals
    doc.setFontSize(11);
    doc.text("Total:", 130, y);
    doc.text(`${bill.total.toFixed(2)} EGP`, 170, y, { align: "right" });
    y += 8;

    // Payment Breakdown
    doc.setFontSize(12);
    doc.text("Payments", 20, y);
    y += 6;

    entries.forEach((e, i) => {
        const method = e.methodName || `Payment ${i + 1}`;
        const amt = e.amount || 0;
        const trans = e.transactionNumber ? ` (#${e.transactionNumber})` : "";
        doc.setFontSize(10);
        doc.text(`${method}${trans}`, 30, y);
        doc.text(`${amt.toFixed(2)} EGP`, 170, y, { align: "right" });
        y += 6;
    });

    y += 10;
    doc.setFontSize(10);
    doc.text("Thank you for your visit!", 105, y, { align: "center" });

    window.open(doc.output("bloburl"), "_blank");
    delayedRedirectToBills();
};

export default generateA4Receipt;
