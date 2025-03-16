'use client'

import { useState, useEffect } from 'react'
import { MdFingerprint } from 'react-icons/md'

const DailyEmployeeAttendance = () => {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [punchInTime] = useState(() => {
        const today = new Date()
        today.setHours(9, 0, 0, 0) // Set to 10:00 AM
        return today
    })
    const [totalHours, setTotalHours] = useState('0:00:00')
    const [productionHours, setProductionHours] = useState('0.00')
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
            updateTotalHours()
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const updateTotalHours = () => {
        const now = new Date()
        const diff = now - punchInTime
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setTotalHours(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
        const totalMinutes = hours * 60 + minutes
        const progressPercentage = Math.min((totalMinutes / (8 * 60)) * 100, 100)
        // setProductionHours((totalMinutes / 60).toFixed(2))
        setProductionHours(`${hours} hours ${minutes} minutes`)
        setProgress(progressPercentage)
    }

    const formatCurrentTime = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(date)
    }

    // Calculate SVG parameters for progress circle
    const size = 160
    const strokeWidth = 4
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (progress / 100) * circumference

    return (
        <div className="w-full md:w-80 rounded-lg border border-violet-600 bg-violet-200 p-6 shadow-lg mb-4">
            <div className="space-y-6">
                {/* Header */}
                <div className="space-y-1">
                    <h2 className="text-gray-500">Attendance</h2>
                    <p className="text-lg font-semibold text-gray-800">{formatCurrentTime(currentTime)}</p>
                </div>

                {/* Progress Circle */}
                <div className="relative flex justify-center">
                    <div className="relative h-40 w-40">
                        <svg className="absolute -rotate-90 transform" width={size} height={size}>
                            {/* Background circle */}
                            <circle
                                className="stroke-gray-200"
                                strokeWidth={strokeWidth}
                                fill="transparent"
                                r={radius}
                                cx={size / 2}
                                cy={size / 2}
                            />
                            {/* Progress circle */}
                            <circle
                                className={`transition-all duration-500 ${progress === 100 ? 'stroke-green-500' : 'stroke-orange-400'}`}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                fill="transparent"
                                r={radius}
                                cx={size / 2}
                                cy={size / 2}
                                style={{
                                    strokeDasharray: circumference,
                                    strokeDashoffset: offset
                                }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-sm text-gray-500">Total Hours</span>
                            <span className="text-xl font-semibold text-gray-800">{totalHours}</span>
                        </div>
                    </div>
                </div>

                {/* Production Hours */}
                <div className="rounded-md bg-gray-50 px-4 py-2">
                    <p className="text-sm text-gray-600">
                        Production : {productionHours}
                    </p>
                </div>

                {/* Punch Status */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MdFingerprint size={20} color='green' />
                    <span>Punched In at {punchInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                </div>

                {/* Punch Out Button */}
                <button
                    className="w-full rounded-md bg-orange-500 py-2.5 text-white transition-colors hover:bg-orange-600"
                >
                    Punch Out
                </button>
            </div>
        </div>
    )
}

export default DailyEmployeeAttendance;