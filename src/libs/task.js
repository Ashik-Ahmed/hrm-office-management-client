"use server"

export async function getAllTasks(employeeEmail, query) {
    const url = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/task/get-all-task/${employeeEmail}?${query}`
    console.log(url);
    const data = await fetch(url)
    const tasks = await data.json();
    console.log('tasks: ', tasks);
    return tasks;
}

export async function getTaskById(taskId) {
    const url = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/task/${taskId}`;
    const data = await fetch(url);
    const taskDetails = await data.json()

    return taskDetails;
}