exports.getAllDepartments = async () => {
    const data = await fetch('http://localhost:5000/api/v1/department', {
        next: { revalidate: 3 }
    })
    const departments = await data.json()

    return departments;
}

exports.getActiveDepartments = async () => {
    const data = await fetch('http://localhost:5000/api/v1/department?status=Active', {
        next: { revalidate: 3 }
    })
    const departments = await data.json()

    return departments;
}