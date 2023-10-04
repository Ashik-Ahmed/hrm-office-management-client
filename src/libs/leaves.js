
exports.getAllLeaves = async () => {
    const leaves = await fetch('http://localhost:5000/api/v1/leave', {
        next: { revalidate: 3 }
    }).then(res => res.json())

    return leaves?.data;
}

exports.getAllLeaveApplicationsByEmployeeId = async (employeeId) => {
    const leaveApplications = await fetch(`http://localhost:5000/api/v1/leaveApplication/${employeeId}`, {
        next: { revalidate: 3 }
    })
        .then(res => res.json())
    // .then(data => {
    //     console.log(data);
    // })

    return leaveApplications?.data;
}

exports.getAllPendingLeaveApplications = async () => {
    const pendingLeaveApplications = await fetch('http://localhost:5000/api/v1/leaveApplication/pendingApplications', {
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

exports.getLeaveStatus = async (employeeId) => {
    console.log(employeeId);
    const leaveStatus = await fetch(`http://localhost:5000/api/v1/employee/leaveStatus/${employeeId}`, {
        next: { revalidate: 3 }
    })
        .then(res => res.json())

    return leaveStatus?.data
}