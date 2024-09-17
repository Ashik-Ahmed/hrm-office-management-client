exports.getAllDepartments = async (accessToken) => {
    const data = await fetch(`${process.env.API_SERVER_UR}/department`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        next: { revalidate: 3 }
    })
    const departments = await data.json()

    return departments;
}

exports.getActiveDepartments = async (accessToken) => {
    const data = await fetch(`${process.env.API_SERVER_UR}/department?status=Active`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        next: { revalidate: 3 }
    })
    const departments = await data.json()

    return departments;
}

exports.getAllRoles = async (accessToken) => {
    const data = await fetch(`${process.env.API_SERVER_UR}/role`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        next: { revalidate: 3 }
    })
    const roles = await data.json()

    return roles;
}