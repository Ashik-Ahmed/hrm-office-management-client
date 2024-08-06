
export async function getMonthName(monthNumber) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Check if the month number is within the valid range
    if (monthNumber < 1 || monthNumber > 12) {
        return "Invalid month number";
    }

    // Return the month name
    return months[monthNumber - 1];
}