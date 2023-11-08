exports.getAllTasks = async (employeeEmail, query) => {
    const url = `http://localhost:5000/api/v1/task/get-all-task/${employeeEmail}?${query}`
    console.log(url);
    const data = await fetch(url)
    const tasks = await data.json();
    console.log('tasks: ', tasks);
    return tasks;
}

exports.getTaskById = async (taskId) => {
    const url = `http://localhost:5000/api/v1/task/${taskId}`;
    const data = await fetch(url);
    const taskDetails = await data.json()

    return taskDetails;
}