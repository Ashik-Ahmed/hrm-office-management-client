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