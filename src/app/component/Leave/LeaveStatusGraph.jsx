import { Chart } from 'primereact/chart';
import React, { useEffect, useState } from 'react';

const LeaveStatusGraph = ({ leaveStatus }) => {
    console.log(leaveStatus);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    // Remove Maternity leave from the array 
    for (let i = 0; i < leaveStatus?.length; i++) {
        if (leaveStatus[i] == "maternity") {
            leaveStatus.splice(i, 1);
        }
    }
    const leaveTypes = leaveStatus?.map(leave => leave.leaveType)
    const availed = leaveStatus?.map(leave => leave.availed);
    const balance = leaveStatus?.map(leave => leave.balance);

    console.log(leaveTypes, availed, balance);

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
                    label: 'Dataset 1',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    data: availed
                },
                {
                    type: 'bar',
                    label: 'Dataset 2',
                    backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
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
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    stacked: true,
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
    }, []);


    return (
        <div>
            <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
    );
};

export default LeaveStatusGraph;