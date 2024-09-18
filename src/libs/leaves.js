"use server"

export async function getAllLeaves() {
    const leaves = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/leave`, {
        next: { revalidate: 3 }
    }).then(res => res.json())

    return leaves?.data;
}

export async function getAllLeaveApplicationsByEmployeeId(employeeId) {
    const leaveApplications = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/leaveApplication/${employeeId}`, {
        next: { revalidate: 3 }
    })
        .then(res => res.json())
    // .then(data => {
    //     console.log(data);
    // })

    return leaveApplications?.data;
}

export async function getAllPendingLeaveApplications() {
    const pendingLeaveApplications = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/leaveApplication/pendingApplications`, {
        next: { revalidate: 3 }
    })
        .then(res => res.json())

    if (pendingLeaveApplications.status == "Success") {
        return pendingLeaveApplications?.data;
    }
    else {
        return "No data"
    }
}

export async function getLeaveStatus(employeeId) {
    console.log(employeeId);
    const leaveStatus = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/employee/leaveStatus/${employeeId}`, {
        next: { revalidate: 3 }
    })
        .then(res => res.json())

    return leaveStatus?.data
}