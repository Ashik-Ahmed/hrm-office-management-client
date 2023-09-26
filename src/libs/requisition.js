exports.getUserRequisitionHistory = async (userId) => {
    const data = await fetch(`http://localhost:5000/api/v1/employee/requisition/${userId}`)
    const requisitions = await data.json()

    return requisitions;
}