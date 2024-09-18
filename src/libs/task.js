exports.getAllTasks = async (employeeEmail, query) => {
    const url = `${process.env.API_SERVER_URL}/task/get-all-task/${employeeEmail}?${query}`
    console.log(url);
    const data = await fetch(url)
    const tasks = await data.json();
    console.log('tasks: ', tasks);
    return tasks;
}

exports.getTaskById = async (taskId) => {
    const url = `${process.env.API_SERVER_URL}/task/${taskId}`;
    const data = await fetch(url);
    const taskDetails = await data.json()

    return taskDetails;
}