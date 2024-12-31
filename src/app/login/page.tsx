'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Input } from '@/components/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '@/lib/api'

const schema = z.object({
  email: z.string().min(1, 'O email é obrigatório'),
  password: z.string().min(1, 'A senha é obrigatória'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const [loginError, setLoginError] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin(data: FormData) {
    try {
      const response = await api.post('/api/auth/login', {
        email: data.email,
        password: data.password,
      })

      if (response.status === 200) {
        setValue('email', '')
        setValue('password', '')

        router.push('/dashboard')
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setLoginError(error.response.data.message)
      } else {
        setLoginError('Ocorreu um erro inesperado. Tente novamente.')
      }
    }
  }

  return (
    <main className="flex flex-col items-center justify-center w-full h-screen bg-zinc-900">
      <h1 className="font-bold text-2xl">Login</h1>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="w-full max-w-96 mx-5"
      >
        <Input
          register={register}
          type="text"
          placeholder="Email"
          name="email"
          error={errors.email?.message}
        />
        <Input
          register={register}
          type="password"
          placeholder="Senha"
          name="password"
          error={errors.password?.message}
        />
        <button
          type="submit"
          className="w-full border-0 rounded h-11 px-2 mt-2 bg-green-500 text-white font-medium"
        >
          Entrar
        </button>
        {loginError && (
          <p className="text-red-500 text-sm mt-2">{loginError}</p>
        )}
      </form>
      <p className="mt-5 text-sm">
        Ainda não tem cadastro? <a href="/signup">Clique aqui</a>.
      </p>
    </main>
  )
}
