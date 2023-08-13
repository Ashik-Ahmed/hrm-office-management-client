
exports.getAllLeaveApplicationsByEmployeeId = async (employeeId) => {
    const leaveApplications = await fetch(`http://localhost:5000/api/v1/leaveApplication/${employeeId}`, {
        cache: 'no-cache',
        next: {
            tags: ["leaveApplications"]
        }
    })
        .then(res => res.json())
    // .then(data => {
    //     console.log(data);
    // })
    console.log(leaveApplications.data);
    return leaveApplications?.data;
}

exports.getAllPendingLeaveApplications = async () => {
    const pendingLeaveApplications = await fetch('http://localhost:5000/api/v1/leaveApplication/pendingApplications', {
        cache: "no-cache"
    })
        .then(res => res.json())

    if (pendingLeaveApplications.status == "Success") {
        return pendingLeaveApplications?.data;
    }
    else {
        return "No data"
    }
}