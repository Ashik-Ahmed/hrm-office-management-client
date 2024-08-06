const { loadImageToBase64 } = require('./dateformatter')

exports.exportRequisition = (requisitionDetails) => {

    const cols = [
        { field: 'name', header: 'Product' },
        { field: 'model', header: 'Details' },
        { field: 'proposedQuantity', header: '#Proposed Qty' },
        // { field: 'approvedQuantity', header: '#Approved Qty' },
        { field: 'unitPrice', header: 'Unit Price' },
        // { field: 'buyingPrice', header: 'Buying Price' },
        { field: 'total', header: 'Total' },
    ]

    const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }))

    const exportToPDF = () => {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(async () => {
                const doc = new jsPDF.default(0, 2);

                var pageSize = doc.internal.pageSize;
                var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();

                // Function to center text
                const centerText = (text, yPosition, underline = false) => {
                    const textWidth = doc.getTextWidth(text);
                    const xPosition = (pageWidth - textWidth) / 2;
                    doc.text(text, xPosition, yPosition);

                    if (underline) {
                        const lineYPosition = yPosition + 1; // Adjust the line position if needed
                        doc.line(xPosition, lineYPosition, xPosition + textWidth, lineYPosition);
                    }
                };

                // Header
                doc.setFontSize(15);
                doc.setTextColor(10);
                // doc.text(`Infozillion Teletech BD LTD.`, 102, 22);
                doc.setFontSize(12);
                centerText(`Requisition`, 42, true);

                doc.setFontSize(11);
                doc.text(`Submitted by: ${requisitionDetails?.submittedBy.name}`, 30, 55);
                doc.text(`Designation: ${requisitionDetails?.submittedBy.designation}`, 30, 65);
                doc.text(`Date: ${requisitionDetails?.createdAt.split("T")[0]}`, 30, 75);
                doc.text(`Department: ${requisitionDetails?.department}`, 30, 85);

                doc.text(`Proposed amount: ${requisitionDetails?.proposedAmount}`, 200, 55);
                doc.text(`#Proposed items: ${requisitionDetails?.totalProposedItems}`, 200, 65);
                doc.text(`Purchase amount: ${requisitionDetails?.purchasedAmount || "__________"}`, 200, 75);
                doc.text(`#Purchase items: ${requisitionDetails?.purchasedItems || "__________"}`, 200, 85);


                const logoBase64 = await loadImageToBase64('/images/logo-with-text.png');

                const imgWidth = 85;
                const imgHeight = 20;
                const x = (pageWidth - imgWidth) / 2;
                // Add logo at the top
                doc.addImage(logoBase64, 'PNG', x, 10, imgWidth, imgHeight);

                doc.autoTable(exportColumns, requisitionDetails.itemList.sort(), {
                    startY: 95,

                    didDrawPage: function (data) {

                        // Footer
                        var str = "Page " + doc.internal.getNumberOfPages();

                        doc.setFontSize(10);

                        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                        var pageSize = doc.internal.pageSize;
                        var pageHeight = pageSize.height
                            ? pageSize.height
                            : pageSize.getHeight();
                        doc.text(str, data.settings.margin.left, pageHeight - 10);
                    }
                });
                var pageSize = doc.internal.pageSize;
                var pageHeight = pageSize.height
                    ? pageSize.height
                    : pageSize.getHeight();
                var pageWidth = pageSize.width
                    ? pageSize.width
                    : pageSize.getWidth();

                var signatureLine = "__________________"
                var signature = requisitionDetails?.submittedBy.name
                doc.text(signatureLine, 20, pageHeight - 40);
                doc.text(signature, 20, pageHeight - 30);
                doc.text(signatureLine, pageWidth - 80, pageHeight - 40);
                doc.text('Samiur Rahman', pageWidth - 80, pageHeight - 30);
                doc.text('Director, Admin & Finance', pageWidth - 80, pageHeight - 24);


                doc.save(`${requisitionDetails?.department} requisition ${requisitionDetails?.createdAt.split("T")[0]}.pdf`);
            })
        })
    }

    exportToPDF()
}

exports.exportRequisitionReport = (requisitionDetails) => {

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');

    const cols = [
        { field: 'createdAt', header: 'Date' },
        { field: 'department', header: 'Department' },
        { field: 'proposedItems', header: '#Proposed item(s)' },
        // { field: 'approvedQuantity', header: '#Approved Qty' },
        { field: 'proposedAmount', header: 'Proposed Amount' },
        // { field: 'buyingPrice', header: 'Buying Price' },
        { field: 'status', header: 'Status' },
    ]

    const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }))


    const exportToPDF = () => {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(async () => {
                const doc = new jsPDF.default(0, 2);

                var pageSize = doc.internal.pageSize;
                var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();

                // Function to center text
                const centerText = (text, yPosition, underline = false) => {
                    const textWidth = doc.getTextWidth(text);
                    const xPosition = (pageWidth - textWidth) / 2;
                    doc.text(text, xPosition, yPosition);

                    if (underline) {
                        const lineYPosition = yPosition + 1; // Adjust the line position if needed
                        doc.line(xPosition, lineYPosition, xPosition + textWidth, lineYPosition);
                    }
                };

                // Header
                doc.setFontSize(15);
                doc.setTextColor(10);
                // centerText(`Infozillion Teletech BD LTD.`, 22, true);
                doc.setFontSize(12);
                centerText(`Requisition Report: ${requisitionDetails?.reportMonth}`, 42, true);

                doc.setFontSize(11);
                doc.text(`Report Month: ${requisitionDetails?.reportMonth}`, 30, 55);
                doc.text(`Total Requisition: ${requisitionDetails?.totalRequisitions}`, 30, 65);
                doc.text(`Report Generated: ${year}-${month}-${day}`, 30, 75);
                doc.text(`Generated By: ${requisitionDetails?.generatedBy}`, 30, 85);

                doc.text(`Required Amount: ${requisitionDetails?.totalProposedAmount}`, 200, 55);
                doc.text(`Purchased Amount: ${requisitionDetails?.totalPurchasedAmount}`, 200, 65);
                doc.text(`Required Items: ${requisitionDetails?.totalProposedItems}`, 200, 75);
                doc.text(`Purchased Items: ${requisitionDetails?.totalPurchasedItems}`, 200, 85);

                // doc.text(`Proposed amount: ${requisitionDetails?.proposedAmount}`, 200, 45);
                // doc.text(`#Proposed items: ${requisitionDetails?.totalProposedItems}`, 200, 55);
                // doc.text(`Purchase amount: ${requisitionDetails?.purchasedAmount || "__________"}`, 200, 65);
                // doc.text(`#Purchase items: ${requisitionDetails?.purchasedItems || "__________"}`, 200, 75);

                const logoBase64 = await loadImageToBase64('/images/logo-with-text.png');

                const imgWidth = 85;
                const imgHeight = 20;
                const x = (pageWidth - imgWidth) / 2;
                // Add logo at the top
                doc.addImage(logoBase64, 'PNG', x, 10, imgWidth, imgHeight);


                doc.autoTable(exportColumns, requisitionDetails.requisitions.sort(), {
                    startY: 95,

                    didDrawPage: function (data) {

                        // Footer
                        var str = "Page " + doc.internal.getNumberOfPages();

                        doc.setFontSize(10);

                        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                        var pageSize = doc.internal.pageSize;
                        var pageHeight = pageSize.height
                            ? pageSize.height
                            : pageSize.getHeight();
                        doc.text(str, data.settings.margin.left, pageHeight - 10);
                    }
                });
                var pageSize = doc.internal.pageSize;
                var pageHeight = pageSize.height
                    ? pageSize.height
                    : pageSize.getHeight();
                var pageWidth = pageSize.width
                    ? pageSize.width
                    : pageSize.getWidth();

                var signatureLine = "__________________"
                // var signature = requisitionDetails?.submittedBy.name
                // doc.text(signatureLine, 20, pageHeight - 40);
                // doc.text(signature, 20, pageHeight - 30);
                doc.text(signatureLine, pageWidth - 80, pageHeight - 40);
                doc.text('Samiur Rahman', pageWidth - 80, pageHeight - 30);
                doc.text('Director, Admin & Finance', pageWidth - 80, pageHeight - 24);


                doc.save(`Requisition report ${requisitionDetails?.reportMonth}.pdf`);
            })
        })
    }
    exportToPDF()

}