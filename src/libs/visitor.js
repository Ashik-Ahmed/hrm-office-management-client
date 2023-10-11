exports.getMonthlyVisitors = async (selectedMonth, selectedYear) => {
    const data = await fetch(`http://localhost:5000/api/v1/visitor?month=${selectedMonth}&year=${selectedYear}`)
    const visitorsData = await data.json();

    return visitorsData;
}