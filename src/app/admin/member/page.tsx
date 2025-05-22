'use client'

import { useState } from 'react'
import { Pencil, RefreshCcw, Trash2, Search,Plus } from 'lucide-react'
import Status from '@/app/components/status'

type User = {
  id: string
  name: string
  email: string
  role: string
  bar: string
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Alice', email: 'alice@example.com', role: 'admin', bar: 'NOIR' },
    { id: '2', name: 'Bob', email: 'bob@example.com', role: 'staff', bar: 'BarSan' },
    { id: '3', name: 'Charlie', email: 'charlie@example.com', role: 'viewer', bar: 'NOIR' },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleEdit = (user: User) => {
    console.log('Edit user', user)
  }

  const handleResetPassword = (user: User) => {
    console.log('Reset password for', user)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id))
      setIsDeleteModalOpen(false)
    }
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Manage member</h1>
        <button className="btn btn-neutral">
          <Plus className="w-4 h-4 mr-2 " />
          Add User</button>
      </div>

      {/* Search Bar */}
      <div className="input input-bordered flex items-center gap-2 bg-white border border-gray-300 w-full md:w-80">
        <Search className="w-4 h-4 text-gray-500" />
        <input
          type="text"
          className="grow"
          placeholder="Find from Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto mt-4">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Bar</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td><Status statusString={user.bar} /></td>
                  <td className="flex justify-end gap-2">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleResetPassword(user)}
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                    <label
                      htmlFor="delete-user-modal"
                      className="btn btn-sm btn-outline btn-error"
                      onClick={() => handleDelete(user)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      <input
        type="checkbox"
        id="delete-user-modal"
        className="modal-toggle"
        checked={isDeleteModalOpen}
        readOnly
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete User</h3>
          <p className="py-4">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{selectedUser?.name}</span>?
          </p>
          <div className="modal-action">
            <label
              htmlFor="delete-user-modal"
              className="btn"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </label>
            <label
              htmlFor="delete-user-modal"
              className="btn btn-error"
              onClick={confirmDelete}
            >
              Delete
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminUsersPage
