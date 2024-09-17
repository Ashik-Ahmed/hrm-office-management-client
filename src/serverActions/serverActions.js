"use server"

const { revalidateTag } = require("next/cache");

exports.leaveApplication = (data) => {
    setLoading(true);
    data.employeeId = session.user._id;
    data.fromDate = fromDate.toLocaleDateString('en-GB')
    data.toDate = toDate.toLocaleDateString('en-GB')
    data.rejoinDate = rejoinDate.toLocaleDateString('en-GB')
    console.log(data);

    fetch(`${process.env.API_SERVER_UR}/leaveApplication`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.status == "Success") {
                resetForm()
                revalidateTag("leaveApplications")
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Application Successful', life: 3000 });
            }
            else {
                toast.current.show({ severity: 'error', summary: 'Failed!', detail: `${data?.error}`, life: 3000 });
            }
        })
}