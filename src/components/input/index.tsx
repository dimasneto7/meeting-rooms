'use client'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface InputProps {
  type: string
  placeholder: string
  name: string
  register: UseFormRegister<any>
  error?: string
  rules?: RegisterOptions
}

export function Input({
  type,
  placeholder,
  name,
  register,
  error,
  rules,
}: InputProps) {
  return (
    <>
      <input
        className="w-full border-0 rounded-md h-11 px-2 mt-2 bg-zinc-700 text-white"
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
        id={name}
      />
      {error && <p className="text-red-500 my-1">{error}</p>}
    </>
  )
}
