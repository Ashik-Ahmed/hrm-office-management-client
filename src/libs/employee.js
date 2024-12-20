"use server"

export async function getEmployeeById(empId, accessToken) {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/employee/${empId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    const employeeInfo = await data.json();

    return employeeInfo.data;
}