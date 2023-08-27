exports.getConveyanceByEmpployeeEmail = async (employeeEmail) => {
    const conveyance = await fetch(`http://localhost:5000/api/v1/conveyance/${employeeEmail}`, {
        cache: 'no-cache'
    })
        .then(res => res.json())


    return conveyance.data;
}