exports.getAllTasks = async (employeeId) => {
    const data = await fetch(`http://localhost:5000/api/v1/task?employeeId=${employeeId}`)
    const tasks = data.json();
    return tasks;
}