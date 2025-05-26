"use client"

import { X, Clock, User, Globe, Smartphone, ArrowRight, AlertCircle, CheckCircle, Info, XCircle } from "lucide-react"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import Activity from "./activityBadge"
import type { ActivityLog } from "@/app/lib/mockData"

interface LogDetailModalProps {
  log: ActivityLog
  onClose: () => void
}

export default function LogDetailModal({ log, onClose }: LogDetailModalProps) {
  const formatDate = (date: Date) => {
    return format(date, "EEEE, d MMMM yyyy 'เวลา' HH:mm:ss น.", { locale: th })
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "danger":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBrowserInfo = (userAgent: string) => {
    if (userAgent.includes("Chrome")) return { browser: "Chrome", icon: "🌐" }
    if (userAgent.includes("Firefox")) return { browser: "Firefox", icon: "🦊" }
    if (userAgent.includes("Safari")) return { browser: "Safari", icon: "🧭" }
    if (userAgent.includes("Edge")) return { browser: "Edge", icon: "🔷" }
    return { browser: "Unknown", icon: "❓" }
  }

  const getDeviceInfo = (userAgent: string) => {
    if (userAgent.includes("iPhone")) return { device: "iPhone", icon: "📱" }
    if (userAgent.includes("Android")) return { device: "Android", icon: "📱" }
    if (userAgent.includes("iPad")) return { device: "iPad", icon: "📱" }
    if (userAgent.includes("Macintosh")) return { device: "Mac", icon: "💻" }
    if (userAgent.includes("Windows")) return { device: "Windows", icon: "💻" }
    return { device: "Unknown", icon: "❓" }
  }

  const browserInfo = log.userAgent ? getBrowserInfo(log.userAgent) : null
  const deviceInfo = log.userAgent ? getDeviceInfo(log.userAgent) : null

  const renderChangeValue = (value: any) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">ไม่มีข้อมูล</span>
    }
    if (typeof value === "boolean") {
      return <span className={value ? "text-green-600" : "text-red-600"}>{value ? "เปิด" : "ปิด"}</span>
    }
    if (typeof value === "object") {
      return <span className="text-gray-600">{JSON.stringify(value)}</span>
    }
    return <span className="font-medium">{value}</span>
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {getSeverityIcon(log.action.severity)}
            <div>
              <h2 className="text-xl font-bold">รายละเอียด Activity Log</h2>
              <p className="text-sm text-gray-500">Log ID: {log.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  ข้อมูลเวลา
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">วันที่และเวลา</p>
                  <p className="font-medium">{formatDate(log.timestamp)}</p>
                  {log.metadata?.duration && (
                    <>
                      <p className="text-sm text-gray-600 mt-2">ระยะเวลาดำเนินการ</p>
                      <p className="font-medium">{log.metadata.duration} มิลลิวินาที</p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  ผู้ดำเนินการ
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-lg">{log.admin.name}</p>
                  <p className="text-sm text-gray-600">ตำแหน่ง: {log.admin.role}</p>
                  <p className="text-sm text-gray-600">ร้าน: {log.admin.cafe}</p>
                  {log.sessionId && <p className="text-xs text-gray-500 mt-2 font-mono">Session: {log.sessionId}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  ข้อมูลการเชื่อมต่อ
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">IP Address</p>
                  <p className="font-mono font-medium">{log.ipAddress}</p>
                  {browserInfo && (
                    <>
                      <p className="text-sm text-gray-600 mt-2">เบราว์เซอร์</p>
                      <p className="font-medium">
                        {browserInfo.icon} {browserInfo.browser}
                      </p>
                    </>
                  )}
                  {deviceInfo && (
                    <>
                      <p className="text-sm text-gray-600 mt-2">อุปกรณ์</p>
                      <p className="font-medium">
                        {deviceInfo.icon} {deviceInfo.device}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">การดำเนินการ</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity activityString={log.action.label} />
                    <span className="font-medium">{log.target.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">รายละเอียด</p>
                  <p className="font-medium">{log.details}</p>
                  {log.target.id && (
                    <>
                      <p className="text-sm text-gray-600 mt-2">Target ID</p>
                      <p className="font-mono text-sm">{log.target.id}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Changes Section */}
          {log.changes && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                การเปลี่ยนแปลงข้อมูล
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Before */}
                  <div>
                    <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      ข้อมูลเดิม (Before)
                    </h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2">
                      {Object.keys(log.changes.before).length === 0 ? (
                        <p className="text-gray-500 italic">ไม่มีข้อมูลเดิม (การสร้างใหม่)</p>
                      ) : (
                        Object.entries(log.changes.before).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">{key}:</span>
                            {renderChangeValue(value)}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* After */}
                  <div>
                    <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      ข้อมูลใหม่ (After)
                    </h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                      {Object.keys(log.changes.after).length === 0 ? (
                        <p className="text-gray-500 italic">ไม่มีข้อมูลใหม่ (การลบ)</p>
                      ) : (
                        Object.entries(log.changes.after).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">{key}:</span>
                            {renderChangeValue(value)}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Changed Fields Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">ฟิลด์ที่มีการเปลี่ยนแปลง:</h4>
                  <div className="flex flex-wrap gap-2">
                    {log.changes.fields.map((field) => (
                      <span key={field} className="badge badge-outline text-xs">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Metadata Section */}
          {log.metadata && (
            <div>
              <h3 className="text-lg font-semibold mb-3">ข้อมูลเพิ่มเติม</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {log.metadata.requestId && (
                    <div>
                      <p className="text-sm text-gray-600">Request ID</p>
                      <p className="font-mono text-sm">{log.metadata.requestId}</p>
                    </div>
                  )}
                  {log.metadata.affectedRecords && (
                    <div>
                      <p className="text-sm text-gray-600">จำนวนข้อมูลที่ได้รับผลกระทบ</p>
                      <p className="font-medium">{log.metadata.affectedRecords} รายการ</p>
                    </div>
                  )}
                  {log.metadata.errorCode && (
                    <div>
                      <p className="text-sm text-gray-600">Error Code</p>
                      <p className="font-mono text-sm text-red-600">{log.metadata.errorCode}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* User Agent Details */}
          {log.userAgent && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                ข้อมูลเบราว์เซอร์
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-mono text-gray-600 break-all">{log.userAgent}</p>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end">
          <button onClick={onClose} className="btn btn-outline">
            ปิด
          </button>
        </div>
      </div>
    </div>
  )
}
