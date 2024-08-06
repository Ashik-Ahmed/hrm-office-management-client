// Load and convert the image to base64
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