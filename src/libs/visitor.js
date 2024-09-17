exports.getMonthlyVisitors = async (selectedMonth, selectedYear, accessToken) => {
    const data = await fetch(`${process.env.API_SERVER_UR}/visitor?month=${selectedMonth}&year=${selectedYear}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    const visitorsData = await data.json();

    return visitorsData;
}