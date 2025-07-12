import jsPDF from "jspdf";
import { toast } from "react-hot-toast";


const delayedRedirectToBills = () => {
    toast.info("Done, back to page");
    setTimeout(() => {
        window.location.href = "/bills";
    }, 1500); // gives time to click "Print" or "Download"
};


const generateThermalReceipt = (bill, entries) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 200], // width: 80mm, height will auto-grow
    });

    let y = 10;

    doc.setFontSize(12);
    doc.text("Le Monde Café", 40, y, { align: "center" });
    y += 6;

    doc.setFontSize(10);
    doc.text(`Bill #${bill.id}`, 10, y);
    doc.text(`Date: ${new Date().toLocaleString("en-EG")}`, 10, (y += 5));

    y += 4;
    doc.text("Items:", 10, y);
    y += 5;

    const fontSize = 10;
    doc.setFontSize(fontSize);

    bill.items?.forEach((item) => {
        const name = item.name || item.item_name || "Item";
        const qty = item.quantity || 1;
        const price = item.price || 0;
        const line = `${qty} x ${name}`;
        const total = `${(price * qty).toFixed(2)} EGP`;

        doc.text(line, 10, y);
        doc.text(total, 70, y, { align: "right" });
        y += 5;
    });

    y += 2;
    doc.setDrawColor(0);
    doc.line(10, y, 70, y);
    y += 5;

    doc.text("Total:", 10, y);
    doc.text(`${bill.total.toFixed(2)} EGP`, 70, y, { align: "right" });
    y += 6;

    entries.forEach((e, i) => {
        const methodName = e.methodName || `Method ${i + 1}`;
        const amt = e.amount;
        doc.text(`${methodName}:`, 10, y);
        doc.text(`${amt.toFixed(2)} EGP`, 70, y, { align: "right" });
        y += 5;
    });

    y += 4;
    doc.setFontSize(9);
    doc.text("Thank you!", 40, y, { align: "center" });

    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
    delayedRedirectToBills();
};

export default generateThermalReceipt;
