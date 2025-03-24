"use server";

export async function getAllHolidays(accessToken, year) {
    const holidays = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/holiday?year=${year}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(res => res.json())

    return holidays;
}

export async function deleteHoliday(holidayId, accessToken) {
    const deleteHoliday = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/holiday/${holidayId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(res => res.json())

    return deleteHoliday;
}

export async function editHoliday(holidayId, data, accessToken) {

    const editHoliday = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/holiday/${holidayId}`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())

    return editHoliday;
}