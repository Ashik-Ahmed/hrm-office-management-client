"use server"

export async function getMonthlyVisitors(selectedMonth, selectedYear, accessToken) {

    console.log(`${process.env.API_SERVER_URL}/visitor?month=${selectedMonth}&year=${selectedYear}`);

    const data = await fetch(`${process.env.API_SERVER_URL}/visitor?month=${selectedMonth}&year=${selectedYear}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    const visitorsData = await data.json();

    return visitorsData;
}