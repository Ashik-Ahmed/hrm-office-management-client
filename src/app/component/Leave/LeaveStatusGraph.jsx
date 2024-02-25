"use client"

import { useSession } from 'next-auth/react';
import { Chart } from 'primereact/chart';
import React, { useEffect, useState } from 'react';

const LeaveStatusGraph = () => {
    const { data: session, status } = useSession();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [leaveStatus, setLeaveStatus] = useState()
    const [loading, setLoading] = useState(false)

    const excludedValue = "Maternity"

    const getLeaveStatusData = (employeeId) => {
        setLoading(true)
        const url = `http://localhost:5000/api/v1/employee/leaveStatus/${employeeId}`

        fetch(url)
            .then(res => res.json())
            .then(data => {

                const leaveExceptMaternity = data?.data?.filter(leave => leave.leaveType !== "Maternity")
                console.log(leaveExceptMaternity);
                setLeaveStatus(leaveExceptMaternity)
            })
        setLoading(false)
    }

    useEffect(() => {
        getLeaveStatusData(session?.user._id)
    }, [session])

    // Remove Maternity leave from the array 
    for (let i = 0; i < leaveStatus?.length; i++) {
        if (leaveStatus[i] === excludedValue) {
            leaveStatus.splice(i, 1);
        }
    }
    const leaveTypes = leaveStatus?.map(leave => leave.leaveType)
    const availed = leaveStatus?.map(leave => leave.availed);
    const balance = leaveStatus?.map(leave => leave.balance);

    // console.log(leaveTypes, availed, balance);

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const data = {
            labels: leaveTypes,
            datasets: [
                {
                    type: 'bar',
                    label: 'Availed',
                    backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
                    data: availed
                },
                {
                    type: 'bar',
                    label: 'Balance',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    data: balance
                }
            ]
        };

        const options = {
            maintainAspectRatio: false,
            aspectRatio: 1,
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    // stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    // stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [leaveStatus]);


    return (
        <div className='bg-white rounded-md p-2 shadow-md w-full'>
            <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
    );
};

export default LeaveStatusGraph;