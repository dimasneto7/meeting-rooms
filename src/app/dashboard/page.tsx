'use client'

import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        console.log('user', user)
      }
    }
    fetchUser()
  }, [])

  // if (!user) return <p>Loading...</p>

  return (
    <div>
      {/* {user && (
        <>
          <h1>Welcome, {user?.name || user.email}</h1>
          <p>Role: {user.role}</p>
        </>
      )} */}
      <h1>Dashboard</h1>
    </div>
  )
}
