const { getMonthName, loadImageToBase64, customDateFormat, default: formatNumberBD } = require('./dateformatter');

exports.exportEmployeeConveyanceToPDF = (employee, conveyanceData, month, year, pendingConveyances) => {
    console.log("conveyanceData: ", conveyanceData);
    const cols = [
        { field: 'date', header: 'Date' },
        { field: 'from', header: 'From' },
        { field: 'destination', header: 'Destination' },
        { field: 'vehicle', header: 'Vehicle' },
        { field: 'purpose', header: 'Purpose' },
        { field: 'amount', header: 'Amount' },
        // { field: 'paymentStatus', header: 'Payment' },
    ]

    const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }))

    let customizedConveyanceDetails;

    if (pendingConveyances) {
        // extract only the date value from dateTime 
        customizedConveyanceDetails = pendingConveyances?.map(conveyance => {
            const customizedDate = customDateFormat(conveyance.date).split(",")[0];
            const customNumberFormat = formatNumberBD(conveyance.amount);
            return {
                ...conveyance,
                date: customizedDate,
                amount: customNumberFormat
            }
        })
    }

    else {
        // extract only the date value from dateTime 
        customizedConveyanceDetails = conveyanceData?.conveyanceDetails.map(conveyance => {
            const customizedDate = customDateFormat(conveyance.date).split(",")[0]
            return {
                ...conveyance,
                date: customizedDate
            }
        })
    }


    const exportPdf = async () => {
        console.log(customizedConveyanceDetails);
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(async () => {
                const doc = new jsPDF.default(0, 2);


                var pageSize = doc.internal.pageSize;

                const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();

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

                if (pendingConveyances) {
                    // Header
                    doc.setFontSize(15);
                    doc.setTextColor(10);
                    // centerText(`Infozillion Teletech BD LTD.`, 22);
                    doc.setFontSize(12);
                    centerText(`Conveyance Bill : ${await getMonthName(month)}-${year}`, 42, true);

                    doc.setFontSize(11);
                    doc.text(`Employee: ${employee.name}`, 30, 55);
                    // doc.text(`Date: ${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`, 30, 65);
                    doc.text(`Date: ${customDateFormat(new Date()).split(",")[0]}`, 30, 65);
                    doc.text(`Total trips: ${conveyanceData.totalConveyances}`, 190, 55);
                    doc.text(`Total amount: ${formatNumberBD(conveyanceData.totalAmount)}`, 190, 65);
                    doc.text(`Due amount: ${formatNumberBD(conveyanceData.totalDueAmount)}`, 190, 75);
                }

                else {
                    // Header
                    doc.setFontSize(15);
                    doc.setTextColor(10);
                    // centerText(`Infozillion Teletech BD LTD.`, 22);
                    doc.setFontSize(12);
                    centerText(`Conveyance Bill : ${await getMonthName(month)}-${year}`, 42, true);

                    doc.setFontSize(11);
                    doc.text(`Employee: ${employee.name}`, 30, 55);
                    // doc.text(`Date: ${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`, 30, 65);
                    doc.text(`Date: ${customDateFormat(new Date()).split(",")[0]}`, 30, 65);
                    doc.text(`Total trips: ${conveyanceData.totalConveyances}`, 190, 55);
                    doc.text(`Total amount: ${formatNumberBD(conveyanceData.totalAmount)}`, 190, 65);
                    doc.text(`Due amount: ${formatNumberBD(conveyanceData.totalDueAmount)}`, 190, 75);
                }


                const logoBase64 = await loadImageToBase64('/images/logo-with-text.png');

                const imgWidth = 85;
                const imgHeight = 20;
                const x = (pageWidth - imgWidth) / 2;
                // Add logo at the top
                doc.addImage(logoBase64, 'PNG', x, 10, imgWidth, imgHeight);

                doc.autoTable(exportColumns, customizedConveyanceDetails.sort(), {
                    startY: 85,
                    styles: {
                        lineWidth: 0.1, // Set the border width
                        lineColor: [200, 200, 200] // Set the border color
                    },
                    didDrawPage: function (data) {

                        // Footer
                        var str = "Page " + doc.internal.getNumberOfPages();


                        doc.setFontSize(10);

                        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                        // var pageSize = doc.internal.pageSize;
                        // var pageHeight = pageSize.height
                        //     ? pageSize.height
                        //     : pageSize.getHeight();

                        doc.text(str, data.settings.margin.left, pageHeight - 10);
                    }
                });


                var signatureLine = "__________________"
                var signature = employee.name
                doc.text(signatureLine, 20, pageHeight - 40);
                doc.text(signature, 20, pageHeight - 30);
                doc.text(signatureLine, pageWidth - 80, pageHeight - 40);
                doc.text('Samiur Rahman', pageWidth - 80, pageHeight - 30);
                doc.text('Director, Admin & Finance', pageWidth - 80, pageHeight - 24);


                doc.save(`${employee.name} conveyance bill ${await getMonthName(month)}-${year}.pdf`);
            })
        })

    }
    exportPdf()

}

exports.exportMonthlyConveyanceReport = (conveyanceData) => {
    // console.log(conveyanceData);

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');

    const cols = [
        { field: 'name', header: 'Name' },
        { field: 'totalConveyances', header: 'Total Trips' },
        { field: 'totalAmount', header: 'Total Bill' },
        { field: 'pendingAmount', header: 'Due Bill' },
    ]

    const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }))

    const exportToPDF = () => {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(async () => {
                const doc = new jsPDF.default(0, 2);

                var pageSize = doc.internal.pageSize;

                const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();

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
                console.log("Conveyance Data: ", conveyanceData);
                if (conveyanceData) {
                    // Header
                    doc.setFontSize(15);
                    doc.setTextColor(10);
                    // doc.text(`Infozillion Teletech BD LTD.`, 102, 22);
                    doc.setFontSize(12);
                    centerText(`Conveyance Report: ${conveyanceData?.reportMonth}`, 42, true);

                    doc.setFontSize(11);
                    // doc.text(`Report Month: ${conveyanceData?.reportMonth}`, 30, 45);
                    // doc.text(`Total Trips: ${conveyanceData?.allEmployeeTotalConveyances}`, 30, 55);
                    doc.text(`Total Bill: ${conveyanceData?.allEmployeeTotalAmount}`, 30, 55);
                    doc.text(`Due Bill: ${conveyanceData?.allEmployeePendingAmount}`, 30, 65);
                    doc.text(`Report Generated: ${year}-${month}-${day}`, 190, 55);
                    doc.text(`Generated By: ${conveyanceData?.generatedBy}`, 190, 65);
                }

                const logoBase64 = await loadImageToBase64('/images/logo-with-text.png');

                const imgWidth = 85;
                const imgHeight = 20;
                const x = (pageWidth - imgWidth) / 2;
                // Add logo at the top
                doc.addImage(logoBase64, 'PNG', x, 10, imgWidth, imgHeight);

                doc.autoTable(exportColumns, conveyanceData.employeeData, {
                    startY: 75,

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

                var signatureLine = "__________________"
                var signature = conveyanceData.generatedBy;
                doc.text(signatureLine, 20, pageHeight - 40);
                doc.text(signature, 20, pageHeight - 30);
                doc.text(signatureLine, pageWidth - 80, pageHeight - 40);
                doc.text('Samiur Rahman', pageWidth - 80, pageHeight - 30);
                doc.text('Director, Admin & Finance', pageWidth - 80, pageHeight - 24);


                doc.save(`Conveyance bill report ${conveyanceData.reportMonth}.pdf`);
            })
        })

    }
    exportToPDF()

}