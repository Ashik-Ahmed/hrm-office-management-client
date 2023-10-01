exports.getAllDepartments = async () => {
    const data = await fetch('http://localhost:5000/api/v1/department', {
        cache: 'no-cache'
    })
    const departments = await data.json()

    return departments;
}