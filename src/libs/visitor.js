exports.getMonthlyVisitors = async (selectedMonth, selectedYear, accessToken) => {
    const data = await fetch(`http://localhost:5000/api/v1/visitor?month=${selectedMonth}&year=${selectedYear}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    const visitorsData = await data.json();

    return visitorsData;
}