const { loadImageToBase64 } = require('./dateformatter')

exports.exportVisitorReport = (visitorData) => {
    // console.log(visitorData);
    const cols = [
        { field: 'createdAt', header: 'Date' },
        { field: 'name', header: 'Name' },
        { field: 'mobile', header: 'Mobile' },
        { field: 'company', header: 'From' },
        // { field: 'approvedQuantity', header: '#Approved Qty' },
        { field: 'designation', header: 'Designation' },
        { field: 'entryTime', header: 'Entry' },
        { field: 'purpose', header: 'Purpose' },
    ]

    const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }))

    const exportToPDF = () => {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(async () => {
                const doc = new jsPDF.default(0, 2)

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
                doc.setFontSize(15)
                doc.setTextColor(10)
                // doc.text(`Infozillion Teletech BD LTD.`, 102, 22)
                doc.setFontSize(12)
                centerText(`Visitor Report: ${visitorData?.reportMonth}`, 42, true)

                doc.setFontSize(11)
                // doc.text(`Report Month: ${visitorData?.reportMonth}`, 30, 55)
                doc.text(`Total visitors: ${visitorData?.visitorList.length}`, 30, 55)

                doc.text(`Generated by: ${visitorData?.generatedBy}`, 30, 65)
                doc.text(`Date: ${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`, 30, 75);


                const logoBase64 = await loadImageToBase64('/images/logo-with-text.png');

                const imgWidth = 85;
                const imgHeight = 20;
                const x = (pageWidth - imgWidth) / 2;
                // Add logo at the top
                doc.addImage(logoBase64, 'PNG', x, 10, imgWidth, imgHeight);

                doc.autoTable(exportColumns, visitorData?.visitorList.sort(), {
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

                var signatureLine = "__________________"
                var signature = visitorData.generatedBy;
                doc.text(signatureLine, 20, pageHeight - 40);
                doc.text(signature, 30, pageHeight - 30);


                doc.save(`Visitor Report - ${visitorData?.reportMonth}.pdf`)


            })
        })
    }

    exportToPDF();

}