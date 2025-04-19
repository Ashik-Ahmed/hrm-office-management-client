"use client";

import React from "react";
import { Chart } from "primereact/chart";

const weekData = [
    { day: "Sun", hours: 8.4 },
    { day: "Mon", hours: 8.5 },
    { day: "Tue", hours: 7.2 },
    { day: "Wed", hours: 8.0 },
    { day: "Thu", hours: 6.5 },
    { day: "Fri", hours: 0 },
    { day: "Sat", hours: 0 },
];

// Function to dynamically set bar colors
const getBarColors = (data) => {
    return data.map((d) => {
        if (d.hours >= 8) return "#22c55e"; // Green
        if (d.hours >= 5) return "#eab308"; // Yellow
        return "#ef4444"; // Red
    });
};

const WeeklyAttendanceChart = () => {
    const labels = weekData.map((item) => item.day);
    const barColors = getBarColors(weekData);

    // Chart Data
    const data = {
        labels,
        datasets: [
            {
                label: "Working Hours",
                data: weekData.map((item) => item.hours),
                backgroundColor: barColors,
                borderRadius: 4,
            },
        ],
    };

    // Chart Options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "#1f2937",
                titleFont: { size: 14, weight: "bold" },
                bodyFont: { size: 12 },
                borderColor: "#e5e7eb",
                borderWidth: 1,
                cornerRadius: 6,
                titleColor: "#ffffff", // White text color for the title
                bodyColor: "#ffffff", // White text color for the body
            },
        },
        scales: {
            x: {
                grid: { display: false },
            },
            y: {
                grid: {
                    color: "#e5e7eb",
                    drawBorder: false,
                },
                ticks: {
                    beginAtZero: true,
                    stepSize: 2,
                },
            },
        },
    };

    return (
        <div className="w-full h-full p-6 bg-white rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Weekly Working Hours</h2>
            <div className="w-full md:h-[366px]" style={{ position: 'relative' }}>
                <Chart type="bar" data={data} options={options} style={{ height: '100%', width: '100%' }} />
            </div>
        </div>
    );
}

export default WeeklyAttendanceChart;