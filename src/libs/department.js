"use server"

export async function getAllDepartments(accessToken) {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/department`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        next: { revalidate: 3 }
    })
    const departments = await data.json()

    return departments;
}

export async function getActiveDepartments(accessToken) {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/department?status=Active`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        next: { revalidate: 3 }
    })
    const departments = await data.json()

    return departments;
}

export async function getAllRoles(accessToken) {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/role`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        next: { revalidate: 3 }
    })
    const roles = await data.json()

    return roles;
}