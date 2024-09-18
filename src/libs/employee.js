exports.getEmployeeById = async (empId, accessToken) => {
    const data = await fetch(`${process.env.API_SERVER_URL}/employee/${empId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    const employeeInfo = await data.json();

    return employeeInfo.data;
}