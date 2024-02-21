exports.getConveyanceDetailsByEmployeeEmail = async (email, month, year) => {
    const url = `http://localhost:5000/api/v1/conveyance/${email}?month=${month}&year=${year}`;

    const conveyanceDetails = await fetch(url, {
        next: { revalidate: 3 }
    }).then(res => res.json())

    return conveyanceDetails.data
}


exports.getConveyanceByEmployeeEmail = async (employeeEmail) => {
    const month = parseInt(new Date().getMonth() + 1)
    const year = parseInt(new Date().getFullYear())
    const conveyance = await fetch(`http://localhost:5000/api/v1/conveyance/${employeeEmail}?month=${month}&year=${year}`,
        {
            next: { revalidate: 3 }
        }
    )
        .then(res => res.json())

    return conveyance.data;
}

exports.getAllEmployeeMonthlyConveyance = async () => {
    const month = parseInt(new Date().getMonth() + 1)
    const year = parseInt(new Date().getFullYear())
    const allConveyance = await fetch(`http://localhost:5000/api/v1/conveyance/?month=${month}&year=${year}`, {
        next: { revalidate: 3 }
    })
        .then(res => res.json())

    return allConveyance.data;
}