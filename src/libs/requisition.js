exports.getUserRequisitionHistory = async (userId, selectedMonth, selectedYear, accessToken) => {
    const data = await fetch(`http://localhost:5000/api/v1/employee/requisition/${userId}?month=${selectedMonth}&year=${selectedYear}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        next: { revalidate: 3 }
    })
    const requisitions = await data.json()

    return requisitions;
}

exports.getMonthlyRequisitionData = async (selectedMonth, selectedYear, accessToken) => {
    const data = await fetch(`http://localhost:5000/api/v1/requisition?month=${selectedMonth}&year=${selectedYear}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        next: { revalidate: 3 }
    })
    const monthlyRequisitionData = await data.json()
    // console.log(monthlyRequisitionData);
    return monthlyRequisitionData;
}