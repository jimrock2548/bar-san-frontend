"use client";
import '@/app/globals.css';

import { useState, useEffect } from "react";
import { DayPicker } from 'react-day-picker'
import {
  FilterIcon,
  SearchIcon,
  CalendarIcon,
  RefreshCwIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
  XCircleIcon,
  TrashIcon,
  EditIcon,
  PlusIcon,
  LogInIcon,
  LogOutIcon,
} from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import Activity from '@/app/components/activityBadge';

// Mock data for activity logs (same as before)
const generateMockLogs = () => {
  const actions = [
    {
      type: "login",
      severity: "info",
      label: "Login",
    },
    {
      type: "logout",
      severity: "info",
      label: "Logout",
    },
    {
      type: "create",
      severity: "success",
      label: "Create",
    },
    {
      type: "edit",
      severity: "warning",
      label: "Edit",
    },
    {
      type: "delete",
      severity: "danger",
      label: "Delete",
    },

    
  ];

  const targets = [
    { type: "user", label: "ผู้ใช้" },
    { type: "reservation", label: "การจอง" },
    { type: "table", label: "โต๊ะ" },
    { type: "cafe", label: "ร้านกาแฟ" },
    { type: "role", label: "บทบาท" },
    { type: "permission", label: "สิทธิ์" },
    { type: "setting", label: "การตั้งค่า" },
  ];

  const admins = [
    { id: 1, name: "สมชาย ใจดี", role: "Admin", cafe: "BarSan" },
    { id: 2, name: "สมหญิง รักสวย", role: "Admin", cafe: "NOIR" },
    { id: 3, name: "สมศักดิ์ มีชัย", role: "Admin", cafe: "Neo Brutal" },
    { id: 4, name: "วิชัย ชาญชัย", role: "Manager", cafe: "BarSan" },
    { id: 5, name: "นภา สวยงาม", role: "Manager", cafe: "NOIR" },
    { id: 6, name: "ประสิทธิ์ ทำงานดี", role: "Staff", cafe: "Neo Brutal" },
  ];

  const logs = [];
  const now = new Date();

  // Generate 100 random logs
  for (let i = 0; i < 100; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const target = targets[Math.floor(Math.random() * targets.length)];
    const admin = admins[Math.floor(Math.random() * admins.length)];

    // Random date within the last 30 days
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60),
      Math.floor(Math.random() * 60)
    );

    // Generate a descriptive message based on the action and target
    let details = "";
    const targetId = Math.floor(Math.random() * 1000) + 1;

    switch (action.type) {
      case "login":
        details = `เข้าสู่ระบบ`;
        break;
      case "logout":
        details = `ออกจากระบบ`;
        break;
      case "create":
        details = `สร้าง${target.label}ใหม่ (ID: ${targetId})`;
        break;
      case "edit":
        details = `แก้ไข${target.label} (ID: ${targetId})`;
        break;
      case "delete":
        details = `ลบ${target.label} (ID: ${targetId})`;
        break;
      default:
    }

    logs.push({
      id: i + 1,
      timestamp: date,
      admin: admin,
      action: action,
      target: target,
      details: details,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
        Math.random() * 255
      )}`,
    });
  }

  // Sort logs by timestamp (newest first)
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};
const ActivityLogPage = ( ) => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [adminFilter, setAdminFilter] = useState("");
  const [cafeFilter, setCafeFilter] = useState("");
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [activeTab, setActiveTab] = useState("all");

  const logsPerPage = 10;

  // Simulate fetching logs from an API
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        const data = generateMockLogs();
        setLogs(data);
        setFilteredLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Apply filters when any filter changes
  useEffect(() => {
    let result = [...logs];

    // Filter by tab (severity)
    if (activeTab !== "all") {
      result = result.filter((log) => log.action.severity === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (log) =>
          log.admin.name.toLowerCase().includes(term) ||
          log.details.toLowerCase().includes(term) ||
          log.ipAddress.includes(term)
      );
    }

    // Filter by action type
    if (actionFilter) {
      result = result.filter((log) => log.action.type === actionFilter);
    }

    // Filter by admin
    if (adminFilter) {
      result = result.filter(
        (log) => log.admin.id === Number.parseInt(adminFilter)
      );
    }

    // Filter by cafe
    if (cafeFilter) {
      result = result.filter((log) => log.admin.cafe === cafeFilter);
    }

    // Filter by date range
    if (dateRange.from) {
      result = result.filter((log) => log.timestamp >= dateRange.from);
    }
    if (dateRange.to) {
      const endDate = new Date(dateRange.to);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter((log) => log.timestamp <= endDate);
    }

    setFilteredLogs(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    logs,
    searchTerm,
    actionFilter,
    adminFilter,
    cafeFilter,
    dateRange,
    activeTab,
  ]);

  // Get current logs for pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setActionFilter("");
    setAdminFilter("");
    setCafeFilter("");
    setDateRange({ from: undefined, to: undefined });
    setActiveTab("all");
  };

  // Export logs as CSV
  const exportLogs = () => {
    // In a real app, this would generate and download a CSV file
    alert("ฟังก์ชันส่งออกข้อมูลจะถูกเพิ่มในอนาคต");
  };

  // Get unique admins for filter dropdown
  const uniqueAdmins = [
    ...new Map(logs.map((log) => [log.admin.id, log.admin])).values(),
  ];

  // Get unique cafes for filter dropdown
  const uniqueCafes = [...new Set(logs.map((log) => log.admin.cafe))];

  // Get unique action types for filter dropdown
  const uniqueActions = [
    ...new Map(logs.map((log) => [log.action.type, log.action])).values(),
  ];

  // Format date for display
  const formatDate = (date) => {
    return format(date, "d MMM yyyy HH:mm:ss", { locale: th });
  };

  // Get badge color based on severity
  const getBadgeVariant = (severity) => {
    switch (severity) {
      case "danger":
        return "destructive";
      case "warning":
        return "warning";
      case "success":
        return "success";
      case "info":
      default:
        return "secondary";
    }
  };

  // Get icon based on severity for tabs
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "danger":
        return <XCircleIcon className="h-4 w-4" />;
      case "warning":
        return <AlertCircleIcon className="h-4 w-4" />;
      case "success":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "info":
      default:
        return <InfoIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">บันทึกกิจกรรมของผู้ดูแลระบบ</h1>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={resetFilters}>
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            รีเซ็ตตัวกรอง
          </button>
          {/*<button className="btn btn-outline" onClick={exportLogs}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            ส่งออก CSV
          </button>*/}
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">ตัวกรองข้อมูล</h2>
          <p className="text-gray-500">กรองบันทึกกิจกรรมตามเงื่อนไขต่างๆ</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">ค้นหา</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <SearchIcon className="h-4 w-4" />
                <input
                  type="text"
                  className="grow"
                  placeholder="ค้นหาตามชื่อ, รายละเอียด, IP"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">ประเภทการกระทำ</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="">ทั้งหมด</option>
                {uniqueActions.map((action) => (
                  <option key={action.type} value={action.type}>
                    {action.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">ผู้ดูแลระบบ</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={adminFilter}
                onChange={(e) => setAdminFilter(e.target.value)}
              >
                <option value="">ทั้งหมด</option>
                {uniqueAdmins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name} ({admin.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">ร้าน</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={cafeFilter}
                onChange={(e) => setCafeFilter(e.target.value)}
              >
                <option value="">ทั้งหมด</option>
                {uniqueCafes.map((cafe) => (
                  <option key={cafe} value={cafe}>
                    {cafe}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">ช่วงวันที่</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  popoverTarget="rdp-popover"
                  className="input input-bordered justify-start text-left"
                  style={{ anchorName: "--rdp" } as React.CSSProperties}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
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
                    <span>เลือกช่วงวันที่</span>
                  )}
                </button>

                {(dateRange.from || dateRange.to) && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      setDateRange({ from: undefined, to: undefined })
                    }
                  >
                    รีเซ็ต
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
                  onSelect={(range) => setDateRange(range)}
                  locale={th}
                  footer={
                    dateRange.from && dateRange.to ? (
                      <p className="text-sm text-gray-400 px-2">
                        เลือกแล้ว:{" "}
                        {format(dateRange.from, "d MMM yyyy", { locale: th })} -{" "}
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
          <h2 className="card-title">บันทึกกิจกรรม</h2>
          <p className="text-gray-500">
            พบ {filteredLogs.length} รายการ จากทั้งหมด {logs.length} รายการ
          </p>

          <div className="tabs tabs-boxed">
            <a
              className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <FilterIcon className="h-4 w-4 mr-2" />
              ทั้งหมด
            </a>
            <a
              className={`tab ${activeTab === "danger" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("danger")}
            >
              <XCircleIcon className="h-4 w-4 mr-2" />
              สำคัญมาก
            </a>
            <a
              className={`tab ${activeTab === "warning" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("warning")}
            >
              <AlertCircleIcon className="h-4 w-4 mr-2" />
              คำเตือน
            </a>
            <a
              className={`tab ${activeTab === "success" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("success")}
            >
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              สำเร็จ
            </a>
            <a
              className={`tab ${activeTab === "info" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              <InfoIcon className="h-4 w-4 mr-2" />
              ข้อมูล
            </a>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : currentLogs.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                </p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>วันที่และเวลา</th>
                    <th>ผู้ดูแลระบบ</th>
                    <th>การกระทำ</th>
                    <th>รายละเอียด</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLogs.map((log) => (
                    <tr key={log.id} className="hover">
                      <td>
                        <div className="text-sm">
                          {formatDate(log.timestamp)}
                        </div>
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
                        <span
                          className={`badge gap-1 ${getBadgeVariant(
                            log.action.severity
                          )}`}
                        >
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
              แสดง {indexOfFirstLog + 1}-
              {Math.min(indexOfLastLog, filteredLogs.length)} จาก{" "}
              {filteredLogs.length} รายการ
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
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={i}
                    className={`join-item btn ${
                      currentPage === pageNum ? "btn-active" : ""
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <button className="join-item btn btn-disabled">...</button>
                  <button
                    className="join-item btn"
                    onClick={() => setCurrentPage(totalPages)}
                  >
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
    </div>
  );
};

export default ActivityLogPage;
