"use client"

import { Plus, Minus, ArrowRight, Shield, Users, Settings, BarChart3, Calendar, Table2, Check, X } from "lucide-react"
import type { PermissionChange } from "@/app/lib/mockData"
import { groupNames } from "@/app/lib/mockData"

interface PermissionChangesProps {
  changes: PermissionChange[]
}

export default function PermissionChanges({ changes }: PermissionChangesProps) {
  const getGroupIcon = (group: string) => {
    switch (group) {
      case "dashboard":
        return <BarChart3 className="h-4 w-4" />
      case "reservation":
        return <Calendar className="h-4 w-4" />
      case "table":
        return <Table2 className="h-4 w-4" />
      case "member":
        return <Users className="h-4 w-4" />
      case "role":
        return <Shield className="h-4 w-4" />
      case "log":
        return <Settings className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "added":
        return <Plus className="h-4 w-4 text-green-600" />
      case "removed":
        return <Minus className="h-4 w-4 text-red-600" />
      case "modified":
        return <ArrowRight className="h-4 w-4 text-blue-600" />
      default:
        return <ArrowRight className="h-4 w-4 text-gray-600" />
    }
  }

  const getChangeColor = (type: string) => {
    switch (type) {
      case "added":
        return "bg-green-50 border-green-200 text-green-800"
      case "removed":
        return "bg-red-50 border-red-200 text-red-800"
      case "modified":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  const getChangeText = (type: string) => {
    switch (type) {
      case "added":
        return "เพิ่มสิทธิ์"
      case "removed":
        return "ลบสิทธิ์"
      case "modified":
        return "แก้ไขสิทธิ์"
      default:
        return "เปลี่ยนแปลง"
    }
  }

  const renderPermissionStatus = (status: boolean | undefined, isAfter = false) => {
    if (status === undefined) {
      return (
        <div className="flex items-center gap-2 text-gray-400">
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
          <span className="text-sm">ไม่มีข้อมูล</span>
        </div>
      )
    }

    return (
      <div className={`flex items-center gap-2 ${status ? "text-green-700" : "text-red-700"}`}>
        {status ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />}
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            status
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {status ? "เปิดใช้งาน" : "ปิดใช้งาน"}
        </span>
      </div>
    )
  }

  // Group changes by group
  const groupedChanges = changes.reduce(
    (acc, change) => {
      if (!acc[change.group]) {
        acc[change.group] = []
      }
      acc[change.group].push(change)
      return acc
    },
    {} as Record<string, PermissionChange[]>,
  )

  // Count changes by type
  const changeCounts = changes.reduce(
    (acc, change) => {
      acc[change.type]++
      return acc
    },
    { added: 0, removed: 0, modified: 0 },
  )

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          สรุปการเปลี่ยนแปลงสิทธิ์
        </h4>
        <div className="flex flex-wrap gap-3">
          {changeCounts.added > 0 && (
            <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-full border border-green-200">
              <Plus className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">เพิ่ม {changeCounts.added} สิทธิ์</span>
            </div>
          )}
          {changeCounts.removed > 0 && (
            <div className="flex items-center gap-2 bg-red-100 px-3 py-2 rounded-full border border-red-200">
              <Minus className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">ลบ {changeCounts.removed} สิทธิ์</span>
            </div>
          )}
          {changeCounts.modified > 0 && (
            <div className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-full border border-blue-200">
              <ArrowRight className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">แก้ไข {changeCounts.modified} สิทธิ์</span>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Changes by Group */}
      <div className="space-y-4">
        {Object.entries(groupedChanges).map(([group, groupChanges]) => (
          <div key={group} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
              {getGroupIcon(group)}
              <h5 className="font-medium text-gray-800">{groupNames[group] || group}</h5>
              <span className="text-sm text-gray-600">({groupChanges.length} การเปลี่ยนแปลง)</span>
            </div>

            <div className="divide-y divide-gray-100">
              {groupChanges.map((change, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">{getChangeIcon(change.type)}</div>

                    <div className="flex-1">
                      {/* Permission Name and Type */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getChangeColor(change.type)}`}>
                          {getChangeText(change.type)}
                        </span>
                        <span className="font-medium text-gray-900">{change.description}</span>
                      </div>

                      {/* Before/After Comparison */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Before Column */}
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-500 mb-2">จาก</p>
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            {change.type === "added"
                              ? renderPermissionStatus(false)
                              : change.type === "removed"
                                ? renderPermissionStatus(true)
                                : renderPermissionStatus(change.before)}
                          </div>
                        </div>

                        {/* After Column */}
                        <div className="text-center">
                          <p
                            className={`text-sm font-medium mb-2 ${
                              change.type === "added"
                                ? "text-green-600"
                                : change.type === "removed"
                                  ? "text-red-600"
                                  : "text-blue-600"
                            }`}
                          >
                            เป็น
                          </p>
                          <div
                            className={`border rounded-lg p-3 ${
                              change.type === "added"
                                ? "bg-green-50 border-green-200"
                                : change.type === "removed"
                                  ? "bg-red-50 border-red-200"
                                  : "bg-blue-50 border-blue-200"
                            }`}
                          >
                            {change.type === "added"
                              ? renderPermissionStatus(true)
                              : change.type === "removed"
                                ? renderPermissionStatus(false)
                                : renderPermissionStatus(change.after)}
                          </div>
                        </div>
                      </div>

                      {/* Permission Code */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Permission Code:{" "}
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{change.permission}</code>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
