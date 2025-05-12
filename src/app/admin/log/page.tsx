"use client"

import React, { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, RotateCcw } from "lucide-react"

interface ActivityLog {
  id: string
  createdAt: string
  action: string
  severity: "INFO" | "WARNING" | "ERROR"
  admin: {
    id: string
    name: string
  }
}

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [sortBy, setSortBy] = useState<"createdAt" | "severity">("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      const mockData: ActivityLog[] = [
        {
          id: "1",
          createdAt: "2025-05-12T10:30:00Z",
          action: "เพิ่มการจอง",
          severity: "INFO",
          admin: { id: "admin1", name: "Admin A" },
        },
        {
          id: "2",
          createdAt: "2025-05-11T14:45:00Z",
          action: "ลบผู้ใช้งาน",
          severity: "ERROR",
          admin: { id: "admin2", name: "Admin B" },
        },
      ]
      setLogs(mockData)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getSeverityColor = (severity: ActivityLog["severity"]) => {
    switch (severity) {
      case "INFO":
        return "badge-info"
      case "WARNING":
        return "badge-warning"
      case "ERROR":
        return "badge-error"
      default:
        return ""
    }
  }

  const sortedLogs = [...logs].sort((a, b) => {
    if (sortBy === "createdAt") {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    } else if (sortBy === "severity") {
      const severityOrder = { INFO: 1, WARNING: 2, ERROR: 3 }
      return sortOrder === "asc"
        ? severityOrder[a.severity] - severityOrder[b.severity]
        : severityOrder[b.severity] - severityOrder[a.severity]
    }
    return 0
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Activity Log</h1>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => window.location.reload()}
        >
          <RotateCcw className="w-4 h-4 animate-spin" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <select
          className="select select-bordered select-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="createdAt">วันที่</option>
          <option value="severity">ความรุนแรง</option>
        </select>
        <button
          className="btn btn-sm"
          onClick={() =>
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          }
        >
          {sortOrder === "asc" ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>การกระทำ</th>
                <th>ผู้ดูแล</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {sortedLogs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.createdAt).toLocaleString("th-TH")}</td>
                  <td>{log.action}</td>
                  <td>{log.admin.name}</td>
                  <td>
                    <span className={`badge ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
