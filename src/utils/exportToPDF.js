exports.exportToPDF = (selectedEmployee, conveyanceData, pendingConveyances) => {

    const cols = [
        { field: 'date', header: 'Date' },
        { field: 'from', header: 'From' },
        { field: 'destination', header: 'Destination' },
        { field: 'vehicle', header: 'Vehicle' },
        { field: 'amount', header: 'Amount' },
        { field: 'purpose', header: 'Purpose' },
    ]

    const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }))

    let customizedConveyanceDetails;

    if (pendingConveyances) {
        // extract only the date value from dateTime 
        customizedConveyanceDetails = pendingConveyances.map(conveyance => {
            const customizedDate = conveyance.date.split("T")[0]
            return {
                ...conveyance,
                date: customizedDate
            }
        })
    }

    if (!pendingConveyances) {
        // extract only the date value from dateTime 
        customizedConveyanceDetails = conveyanceData?.conveyanceDetails.map(conveyance => {
            const customizedDate = conveyance.date.split("T")[0]
            return {
                ...conveyance,
                date: customizedDate
            }
        })
    }


    const exportPdf = () => {
        console.log(customizedConveyanceDetails);
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 2);

                if (pendingConveyances) {
                    // Header
                    doc.setFontSize(15);
                    doc.setTextColor(10);
                    doc.text(`Infozillion Teletech BD LTD.`, 102, 22);
                    doc.setFontSize(12);
                    doc.text(`Conveyance Bill`, 130, 32);

                    doc.setFontSize(11);
                    doc.text(`Employee: ${selectedEmployee.name}`, 40, 45);
                    doc.text(`Total bill: ${conveyanceData.totalDueAmount}`, 210, 45);
                    doc.text(`Date: ${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`, 40, 55);
                    doc.text(`Total trips: ${conveyanceData.pendingConveyances}`, 210, 55);
                }

                if (!pendingConveyances) {
                    // Header
                    doc.setFontSize(15);
                    doc.setTextColor(10);
                    doc.text(`Infozillion Teletech BD LTD.`, 102, 22);
                    doc.setFontSize(12);
                    doc.text(`Monthly Conveyance Bill`, 112, 32);

                    doc.setFontSize(11);
                    doc.text(`Employee: ${selectedEmployee.name}`, 40, 45);
                    doc.text(`Total amount: ${conveyanceData.totalAmount}`, 210, 45);
                    doc.text(`Date: ${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`, 40, 55);
                    doc.text(`Total trips: ${conveyanceData.totalConveyances}`, 210, 55);
                }



                doc.autoTable(exportColumns, customizedConveyanceDetails.sort(), {
                    startY: 70,

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
                var signatureLine = "__________________"
                var signature = selectedEmployee.name
                doc.text(signatureLine, 20, pageHeight - 40);
                doc.text(signature, 20, pageHeight - 30);


                doc.save(`${selectedEmployee.name} conveyance bill.pdf`);
            })
        })

    }
    exportPdf()

}