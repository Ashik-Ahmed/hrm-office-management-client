

const getAllLeaveApplications = async (employeeId) => {
    const leaveApplications = await fetch(`http://localhost:5000/api/v1/leaveApplication/${employeeId}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })

    return leaveApplications;
}

module.exports = getAllLeaveApplications;