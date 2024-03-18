exports.getAllDepartments = async (accessToken) => {
    const data = await fetch('http://localhost:5000/api/v1/department', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        next: { revalidate: 3 }
    })
    const departments = await data.json()

    return departments;
}

exports.getActiveDepartments = async (accessToken) => {
    const data = await fetch('http://localhost:5000/api/v1/department?status=Active', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        next: { revalidate: 3 }
    })
    const departments = await data.json()

    return departments;
}