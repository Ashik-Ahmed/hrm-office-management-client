exports.exportRequisition = (requisitionDetails) => {

    const totalBodyTemplate = () => {
        return 'sdfiu'
    }

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
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 2);

                // Header
                doc.setFontSize(15);
                doc.setTextColor(10);
                doc.text(`Infozillion Teletech BD LTD.`, 102, 22);
                doc.setFontSize(12);
                doc.text(`Requisition`, 130, 32);

                doc.setFontSize(11);
                doc.text(`Submitted by: ${requisitionDetails?.submittedBy.name}`, 30, 45);
                doc.text(`Designation: ${requisitionDetails?.submittedBy.designation}`, 30, 55);
                doc.text(`Date: ${requisitionDetails?.createdAt.split("T")[0]}`, 30, 65);
                doc.text(`Department: ${requisitionDetails?.department}`, 30, 75);

                doc.text(`Proposed amount: ${requisitionDetails?.proposedAmount}`, 200, 45);
                doc.text(`#Proposed items: ${requisitionDetails?.totalProposedItems}`, 200, 55);
                doc.text(`Purchase amount: ${requisitionDetails?.purchasedAmount || "__________"}`, 200, 65);
                doc.text(`#Purchase items: ${requisitionDetails?.purchasedItems || "__________"}`, 200, 75);


                doc.autoTable(exportColumns, requisitionDetails.itemList.sort(), {
                    startY: 85,

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
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 2);

                // Header
                doc.setFontSize(15);
                doc.setTextColor(10);
                doc.text(`Infozillion Teletech BD LTD.`, 102, 22);
                doc.setFontSize(12);
                doc.text(`Requisition Report: ${requisitionDetails?.reportMonth}`, 120, 32);

                doc.setFontSize(11);
                doc.text(`Report Month: ${requisitionDetails?.reportMonth}`, 30, 45);
                doc.text(`Total Requisition: ${requisitionDetails?.totalRequisitions}`, 30, 55);
                doc.text(`Report Generated: ${year}-${month}-${day}`, 30, 65);
                doc.text(`Generated By: ${requisitionDetails?.generatedBy}`, 30, 75);

                doc.text(`Required Amount: ${requisitionDetails?.totalProposedAmount}`, 200, 45);
                doc.text(`Purchased Amount: ${requisitionDetails?.totalPurchasedAmount}`, 200, 55);
                doc.text(`Required Items: ${requisitionDetails?.totalProposedItems}`, 200, 65);
                doc.text(`Purchased Items: ${requisitionDetails?.totalPurchasedItems}`, 200, 75);

                // doc.text(`Proposed amount: ${requisitionDetails?.proposedAmount}`, 200, 45);
                // doc.text(`#Proposed items: ${requisitionDetails?.totalProposedItems}`, 200, 55);
                // doc.text(`Purchase amount: ${requisitionDetails?.purchasedAmount || "__________"}`, 200, 65);
                // doc.text(`#Purchase items: ${requisitionDetails?.purchasedItems || "__________"}`, 200, 75);


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