exports.exportRequisition = (requisitionDetails) => {

    const cols = [
        { field: 'name', header: 'Product' },
        { field: 'proposedQuantity', header: '#Proposed Qty' },
        { field: 'approvedQuantity', header: '#Approved Qty' },
        { field: 'unitPrice', header: 'Unit Price' },
        { field: 'buyingPrice', header: 'Buying Price' },
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
                doc.text(`Purchase amount: ${requisitionDetails?.finalAmount}`, 200, 65);
                doc.text(`Purchase items: ${requisitionDetails?.totalApprovedItems}`, 200, 75);


                doc.autoTable(exportColumns, requisitionDetails.itemList.sort(), {
                    startY: 85,

                    didDrawPage: function (data) {

                        // Footer
                        var str = "Page " + doc.internal.getNumberOfPages();
                        var signatureLine = "__________________"
                        var signature = requisitionDetails?.submittedBy.name

                        doc.setFontSize(10);

                        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                        var pageSize = doc.internal.pageSize;
                        var pageHeight = pageSize.height
                            ? pageSize.height
                            : pageSize.getHeight();
                        doc.text(str, data.settings.margin.left, pageHeight - 10);
                        doc.text(signatureLine, data.settings.margin.left, pageHeight - 40);
                        doc.text(signature, data.settings.margin.left, pageHeight - 30);
                    }
                });


                doc.save('requisition.pdf');
            })
        })
    }

    exportToPDF()
}