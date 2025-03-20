exports.exportEmployeeAttendanceToPDF = (employee, attendanceData, month, year) => {

    const cols = [
        { field: 'date', header: 'Date' },
        { field: 'checkIn', header: 'Check In' },
        { field: 'checkOut', header: 'Check Out' },
        { field: 'break', header: 'Break' },
        { field: 'late', header: 'Late' },
        { field: 'overtime', header: 'Overtime' },
        { field: 'productionHours', header: 'Production Hours' },
    ]

    const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }))

    const exportToPDF = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, attendanceData);
                doc.save('attendance report.pdf');
            });
        });
    }

    exportToPDF();
}