"use server";

export async function getAllHolidays(accessToken) {
    const holidays = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/holiday`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(res => res.json())

    return holidays?.data;
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