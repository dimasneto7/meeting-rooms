'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Input } from '@/components/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '@/lib/api'

const schema = z
  .object({
    name: z.string().min(1, 'O nome é obrigatório'),
    email: z
      .string()
      .email('Insira um email válido')
      .min(1, 'O email é obrigatório'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'A confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'], // Adiciona a mensagem de erro ao campo confirmPassword
  })

type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const [signupError, setSignupError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignup(data: FormData) {
    try {
      const response = await api.post('/api/auth/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
      })

      if (response.status === 201) {
        setValue('name', '')
        setValue('email', '')
        setValue('password', '')
        setValue('confirmPassword', '')

        router.push('/login')
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setSignupError(error.response.data.message)
      } else {
        setSignupError('Ocorreu um erro inesperado. Tente novamente.')
      }
    }
  }

  return (
    <main className="flex flex-col items-center justify-center w-full h-screen bg-zinc-900">
      <h1 className="font-bold text-2xl">Faça o seu cadastro</h1>
      <form
        onSubmit={handleSubmit(handleSignup)}
        className="w-full max-w-96 mx-5"
      >
        <Input
          register={register}
          type="text"
          placeholder="Nome"
          name="name"
          error={errors.name?.message}
        />

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

        <Input
          register={register}
          type="password"
          placeholder="Confirme sua senha"
          name="confirmPassword"
          error={errors.confirmPassword?.message}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full border-0 rounded h-11 px-2 mt-2 bg-green-500 text-white font-medium"
        >
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
        {signupError && (
          <p className="text-red-500 text-sm mt-2">{signupError}</p>
        )}
      </form>
      <p className="mt-5 text-sm">
        Já tem um cadastro? <a href="/login">Clique aqui</a>.
      </p>
    </main>
  )
}
