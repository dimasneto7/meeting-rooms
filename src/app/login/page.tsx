'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      router.push('/dashboard')
    } else {
      alert('Login failed')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-zinc-900">
      <h1 className="font-bold text-2xl">Login</h1>
      <form>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full max-w-96 border-0 rounded h-11 px-2 mt-2 bg-zinc-700 text-white"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full max-w-96 border-0 rounded h-11 px-2 mt-2 bg-zinc-700 text-white"
        />
        <button
          onClick={handleLogin}
          className="w-full max-w-96 border-0 rounded h-11 px-2 mt-2 bg-green-500 text-white font-bold"
        >
          Login
        </button>
      </form>
    </div>
  )
}
