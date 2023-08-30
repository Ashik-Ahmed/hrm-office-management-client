exports.getConveyanceByEmployeeEmail = async (employeeEmail) => {
    const month = parseInt(new Date().getMonth() + 1)
    const year = parseInt(new Date().getFullYear())
    const conveyance = await fetch(`http://localhost:5000/api/v1/conveyance/${employeeEmail}?month=${month}&year=${year}`, {
        cache: 'no-cache'
    })
        .then(res => res.json())


    return conveyance.data;
}

exports.getAllEmployeeMonthlyConveyance = async () => {
    const month = parseInt(new Date().getMonth() + 1)
    const year = parseInt(new Date().getFullYear())
    const allConveyance = await fetch(`http://localhost:5000/api/v1/conveyance/?month=${month}&year=${year}`, {
        cache: 'no-cache'
    })
        .then(res => res.json())


    return allConveyance.data;
}