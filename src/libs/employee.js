exports.getEmployeeById = async (empId, accessToken) => {
    const data = await fetch(`http://localhost:5000/api/v1/employee/${empId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    const employeeInfo = await data.json();

    return employeeInfo.data;
}