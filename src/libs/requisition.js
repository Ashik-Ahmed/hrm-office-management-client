"use server"

export async function getUserRequisitionHistory(userId, selectedMonth, selectedYear, accessToken) {
    const data = await fetch(`${process.env.API_SERVER_URL}/employee/requisition/${userId}?month=${selectedMonth}&year=${selectedYear}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        next: { revalidate: 3 }
    })
    const requisitions = await data.json()

    return requisitions;
}

export async function getMonthlyRequisitionData(selectedMonth, selectedYear, accessToken) {
    const data = await fetch(`${process.env.API_SERVER_URL}/requisition?month=${selectedMonth}&year=${selectedYear}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        next: { revalidate: 3 }
    })
    const monthlyRequisitionData = await data.json()
    // console.log(monthlyRequisitionData);
    return monthlyRequisitionData;
}