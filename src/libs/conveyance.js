"use server"

export async function getConveyanceDetailsByEmployeeEmail(email, month, year, accessToken) {
    const url = `${process.env.API_SERVER_URL}/conveyance/${email}?month=${month}&year=${year}`;

    const conveyanceDetails = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        next: { revalidate: 3 }
    }).then(res => res.json())

    return conveyanceDetails.data
}


export async function getConveyanceByEmployeeEmail(employeeEmail) {
    const month = parseInt(new Date().getMonth() + 1)
    const year = parseInt(new Date().getFullYear())
    const conveyance = await fetch(`${process.env.API_SERVER_URL}/conveyance/${employeeEmail}?month=${month}&year=${year}`,
        {
            next: { revalidate: 3 }
        }
    )
        .then(res => res.json())

    return conveyance.data;
}

export async function getAllEmployeeMonthlyConveyance() {
    const month = parseInt(new Date().getMonth() + 1)
    const year = parseInt(new Date().getFullYear())
    const allConveyance = await fetch(`${process.env.API_SERVER_URL}/conveyance/?month=${month}&year=${year}`, {
        next: { revalidate: 3 }
    })
        .then(res => res.json())

    return allConveyance.data;
}