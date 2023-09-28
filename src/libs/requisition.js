exports.getUserRequisitionHistory = async (userId, selectedMonth, selectedYear) => {
    const data = await fetch(`http://localhost:5000/api/v1/employee/requisition/${userId}?month=${selectedMonth}&year=${selectedYear}`, {
        cache: 'no-cache'
    })
    const requisitions = await data.json()

    return requisitions;
}