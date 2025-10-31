import React from "react";

const ExportPDF = () => {
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = "http://localhost:3001/generate-pdf"; // API endpoint
        link.setAttribute("download", "exported.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return <button onClick={handleDownload}>Download PDF</button>;
};

export default ExportPDF;