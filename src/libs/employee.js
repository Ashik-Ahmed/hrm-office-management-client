exports.getEmployeeById = async (empId) => {
    const data = await fetch(`http://localhost:5000/api/v1/employee/${empId}`)

    const employeeInfo = await data.json();

    return employeeInfo.data;
}