export async function loadImageToBase64(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load image: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};


export function getMonthName(monthNumber) {
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

export function customDateFormat(utcTimeStr) {

    if (!utcTimeStr || isNaN(Date.parse(utcTimeStr))) {
        return "Invalid Date";  // or any default value you prefer
    }

    // Convert to Date object
    const utcDate = new Date(utcTimeStr);

    // Convert to Bangladesh local time (UTC+6)
    const options = {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };

    // Format the date and time
    const bangladeshTime = new Intl.DateTimeFormat("en-GB", options)?.format(utcDate);

    // Adjust the format to match the desired output
    const formattedTime = bangladeshTime?.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1-$2-$3");

    return formattedTime;

}