exports.getAllTasks = async (employeeEmail, query) => {
    const url = `http://localhost:5000/api/v1/task/employeeEmail=${employeeEmail}?${query}`
    console.log(url);
    const data = await fetch(url)
    const tasks = await data.json();
    console.log('tasks: ', tasks);
    return tasks;
}