'use client'

import React, { useState, useEffect } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { FiUsers, FiDollarSign, FiShoppingCart, FiActivity, FiTrendingUp, FiPackage } from 'react-icons/fi'
import { motion } from 'framer-motion'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const barChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Sales vs Revenue',
        },
    },
    scales: {
        x: {
            type: 'category',
        },
        y: {
            beginAtZero: true,
        },
    },
}

const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            label: 'Sales',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
            label: 'Revenue',
            data: [2, 3, 20, 5, 1, 4],
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
    ],
}

const lineChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'User Growth',
        },
    },
    scales: {
        x: {
            type: 'category',
        },
        y: {
            beginAtZero: true,
        },
    },
}

const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            label: 'Users',
            data: [100, 120, 115, 134, 168, 180],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        },
    ],
}

const StatCard = ({ title, value, icon: Icon, gradient }) => (
    <motion.div
        className={`p-6 rounded-lg shadow-lg ${gradient}`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-200 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
            <Icon className="text-white text-3xl" />
        </div>
    </motion.div>
)

export default function Dashboard() {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const generateRandomAmount = () => (Math.random() * 100).toFixed(2)

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <motion.header
                className="bg-white shadow"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Users" value="1,234" icon={FiUsers} gradient="bg-gradient-to-r from-blue-500 to-blue-600" />
                    <StatCard title="Total Revenue" value="$12,345" icon={FiDollarSign} gradient="bg-gradient-to-r from-green-500 to-green-600" />
                    <StatCard title="Total Orders" value="846" icon={FiShoppingCart} gradient="bg-gradient-to-r from-purple-500 to-purple-600" />
                    <StatCard title="Conversion Rate" value="2.3%" icon={FiActivity} gradient="bg-gradient-to-r from-red-500 to-red-600" />
                </div>

                {/* Charts */}
                {isClient && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <motion.div
                            className="bg-white p-6 rounded-lg shadow"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="text-xl font-semibold mb-4">Sales vs Revenue</h2>
                            <Bar options={barChartOptions} data={barChartData} />
                        </motion.div>
                        <motion.div
                            className="bg-white p-6 rounded-lg shadow"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="text-xl font-semibold mb-4">User Growth</h2>
                            <Line options={lineChartOptions} data={lineChartData} />
                        </motion.div>
                    </div>
                )}

                {/* Table */}
                <motion.div
                    className="bg-white shadow rounded-lg overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b">Recent Orders</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {[...Array(5)].map((_, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{1000 + index}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Customer {index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <FiPackage className="mr-2 text-gray-400" />
                                                Product {index + 1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <FiTrendingUp className="mr-2 text-green-500" />
                                                {isClient ? `$${generateRandomAmount()}` : '$0.00'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Completed
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}