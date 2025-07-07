"use client"
import "@/app/globals.css"
import type React from "react"
import withAuth from "@/app/lib/withauth"

import { useState, useEffect } from "react"
import { DayPicker } from "react-day-picker"
import {
  FilterIcon,
  SearchIcon,
  CalendarIcon,
  RefreshCwIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
  XCircleIcon,
} from "lucide-react"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import Activity from "@/app/components/activityBadge"
import { generateMockLogs, type ActivityLog } from "@/app/lib/mockData"
import LogDetailModal from "@/app/components/logDetailModal"

const ActivityLogPage = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("")
  const [adminFilter, setAdminFilter] = useState("")
  const [cafeFilter, setCafeFilter] = useState("")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [activeTab, setActiveTab] = useState("all")
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)

  const logsPerPage = 10

  const openLogDetails = (log: ActivityLog) => {
    setSelectedLog(log)
  }

  const closeLogDetails = () => {
    setSelectedLog(null)
  }

  // Simulate fetching logs from an API
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      try {
        const data = generateMockLogs()
        setLogs(data)
        setFilteredLogs(data)
      } catch (error) {
        console.error("Error fetching logs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  // Apply filters when any filter changes
  useEffect(() => {
    let result = [...logs]

    // Filter by tab (severity)
    if (activeTab !== "all") {
      result = result.filter((log) => log.action.severity === activeTab)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (log) =>
          log.admin.name.toLowerCase().includes(term) ||
          log.details.toLowerCase().includes(term) ||
          log.ipAddress.includes(term),
      )
    }

    // Filter by action type
    if (actionFilter) {
      result = result.filter((log) => log.action.type === actionFilter)
    }

    // Filter by admin
    if (adminFilter) {
      result = result.filter((log) => log.admin.id === Number.parseInt(adminFilter))
    }

    // Filter by cafe
    if (cafeFilter) {
      result = result.filter((log) => log.admin.cafe === cafeFilter)
    }

    // Filter by date range
    if (dateRange.from) {
      result = result.filter((log) => log.timestamp >= dateRange.from!)
    }
    if (dateRange.to) {
      const endDate = new Date(dateRange.to)
      endDate.setHours(23, 59, 59, 999)
      result = result.filter((log) => log.timestamp <= endDate)
    }

    setFilteredLogs(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [logs, searchTerm, actionFilter, adminFilter, cafeFilter, dateRange, activeTab])

  // Get current logs for pagination
  const indexOfLastLog = currentPage * logsPerPage
  const indexOfFirstLog = indexOfLastLog - logsPerPage
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog)
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage)

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setActionFilter("")
    setAdminFilter("")
    setCafeFilter("")
    setDateRange({ from: undefined, to: undefined })
    setActiveTab("all")
  }

  // Get unique admins for filter dropdown
  const uniqueAdmins = [...new Map(logs.map((log) => [log.admin.id, log.admin])).values()]

  // Get unique cafes for filter dropdown
  const uniqueCafes = [...new Set(logs.map((log) => log.admin.cafe))]

  // Get unique action types for filter dropdown
  const uniqueActions = [...new Map(logs.map((log) => [log.action.type, log.action])).values()]

  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, "d MMM yyyy HH:mm:ss", { locale: th })
  }

  // Get badge color based on severity
  const getBadgeVariant = (severity: string) => {
    switch (severity) {
      case "danger":
        return "badge-error"
      case "warning":
        return "badge-warning"
      case "success":
        return "badge-success"
      case "info":
      default:
        return "badge-info"
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Administrator Activity Log</h1>
          <p className="text-gray-500">Track all administrative actions and system events</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={resetFilters}>
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Reset Filters
          </button>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Data Filter</h2>
          <p className="text-gray-500">Filter activity logs by various conditions</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Search</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <SearchIcon className="h-4 w-4" />
                <input
                  type="text"
                  className="grow"
                  placeholder="Search by name, details, IP"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Action Type</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="">All Actions</option>
                {uniqueActions.map((action) => (
                  <option key={action.type} value={action.type}>
                    {action.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Administrator</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={adminFilter}
                onChange={(e) => setAdminFilter(e.target.value)}
              >
                <option value="">All Admins</option>
                {uniqueAdmins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name} ({admin.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Store</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={cafeFilter}
                onChange={(e) => setCafeFilter(e.target.value)}
              >
                <option value="">All Stores</option>
                {uniqueCafes.map((cafe) => (
                  <option key={cafe} value={cafe}>
                    {cafe}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Date Range</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  popoverTarget="rdp-popover"
                  className="input input-bordered justify-start text-left flex items-center gap-2"
                  style={{ anchorName: "--rdp" } as React.CSSProperties}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "d MMM yyyy", { locale: th })} -{" "}
                        {format(dateRange.to, "d MMM yyyy", { locale: th })}
                      </>
                    ) : (
                      format(dateRange.from, "d MMM yyyy", { locale: th })
                    )
                  ) : (
                    <span>Select date range</span>
                  )}
                </button>

                {(dateRange.from || dateRange.to) && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setDateRange({ from: undefined, to: undefined })}
                  >
                    Reset
                  </button>
                )}
              </div>

              <div
                popover="auto"
                id="rdp-popover"
                className="dropdown z-50"
                style={{ positionAnchor: "--rdp" } as React.CSSProperties}
              >
                <DayPicker
                  className="react-day-picker rounded-lg p-2 text-lg"
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                  locale={th}
                  footer={
                    dateRange.from && dateRange.to ? (
                      <p className="text-sm text-gray-400 px-2">
                        Selected: {format(dateRange.from, "d MMM yyyy", { locale: th })} -{" "}
                        {format(dateRange.to, "d MMM yyyy", { locale: th })}
                      </p>
                    ) : null
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Activity Log</h2>
          <p className="text-gray-500">
            Found {filteredLogs.length} items out of {logs.length} total items
          </p>

          <div className="tabs tabs-boxed">
            <a className={`tab ${activeTab === "all" ? "tab-active" : ""}`} onClick={() => setActiveTab("all")}>
              <FilterIcon className="h-4 w-4 mr-2" />
              All ({logs.length})
            </a>
            <a className={`tab ${activeTab === "danger" ? "tab-active" : ""}`} onClick={() => setActiveTab("danger")}>
              <XCircleIcon className="h-4 w-4 mr-2" />
              Critical ({logs.filter((l) => l.action.severity === "danger").length})
            </a>
            <a className={`tab ${activeTab === "warning" ? "tab-active" : ""}`} onClick={() => setActiveTab("warning")}>
              <AlertCircleIcon className="h-4 w-4 mr-2" />
              Warning ({logs.filter((l) => l.action.severity === "warning").length})
            </a>
            <a className={`tab ${activeTab === "success" ? "tab-active" : ""}`} onClick={() => setActiveTab("success")}>
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Success ({logs.filter((l) => l.action.severity === "success").length})
            </a>
            <a className={`tab ${activeTab === "info" ? "tab-active" : ""}`} onClick={() => setActiveTab("info")}>
              <InfoIcon className="h-4 w-4 mr-2" />
              Info ({logs.filter((l) => l.action.severity === "info").length})
            </a>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : currentLogs.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No results found matching your search criteria</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date and Time</th>
                    <th>Administrator</th>
                    <th>Action</th>
                    <th>Details</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLogs.map((log) => (
                    <tr key={log.id} className="hover cursor-pointer" onClick={() => openLogDetails(log)}>
                      <td>
                        <div className="text-sm">{formatDate(log.timestamp)}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-bold">{log.admin.name}</div>
                            <div className="text-xs text-gray-500">
                              {log.admin.role} • {log.admin.cafe}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge gap-1 `}>
                          <Activity activityString={log.action.label} />
                        </span>
                      </td>
                      <td>
                        <div className="text-sm">{log.details}</div>
                      </td>
                      <td>
                        <div className="text-sm font-mono">{log.ipAddress}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstLog + 1}-{Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length}{" "}
              items
            </div>

            <div className="join">
              <button
                className="join-item btn"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={i}
                    className={`join-item btn ${currentPage === pageNum ? "btn-active" : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <button className="join-item btn btn-disabled">...</button>
                  <button className="join-item btn" onClick={() => setCurrentPage(totalPages)}>
                    {totalPages}
                  </button>
                </>
              )}

              <button
                className="join-item btn"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && <LogDetailModal log={selectedLog} onClose={closeLogDetails} />}
    </div>
  )
}

export default withAuth(ActivityLogPage)
