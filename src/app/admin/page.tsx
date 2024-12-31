'use client'

import { useEffect, useState } from 'react'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  status: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users')
        if (!res.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await res.json()
        setUsers(data.users)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleUpdateUser = async (
    userId: string,
    role: string,
    status: string
  ) => {
    try {
      const res = await fetch('/api/admin/update-user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role, status }),
      })

      if (!res.ok) {
        throw new Error('Failed to update user')
      }

      alert('User updated successfully!')
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role, status } : user
        )
      )
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name || 'N/A'}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleUpdateUser(user.id, e.target.value, user.status)
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <select
                  value={user.status}
                  onChange={(e) =>
                    handleUpdateUser(user.id, user.role, e.target.value)
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => handleUpdateUser(user.id, 'user', 'inactive')}
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
