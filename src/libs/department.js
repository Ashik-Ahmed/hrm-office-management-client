exports.getAllDepartments = async (accessToken) => {
    const data = await fetch(`${process.env.API_SERVER_URL}/department`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        next: { revalidate: 3 }
    })
    const departments = await data.json()

    return departments;
}

exports.getActiveDepartments = async (accessToken) => {
    const data = await fetch(`${process.env.API_SERVER_URL}/department?status=Active`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        next: { revalidate: 3 }
    })
    const departments = await data.json()

    return departments;
}

exports.getAllRoles = async (accessToken) => {
    const data = await fetch(`${process.env.API_SERVER_URL}/role`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        next: { revalidate: 3 }
    })
    const roles = await data.json()

    return roles;
}