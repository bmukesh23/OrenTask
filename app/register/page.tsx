"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"  
import { z } from "zod"                    

// Zod schema
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // ✅ validate form
    const validation = registerSchema.safeParse({ name, email, password })
    if (!validation.success) {
      setError(validation.error.errors[0].message)
      return
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    })

    if (res.ok) {
      router.push("/dashboard")
    } else {
      const data = await res.json()
      setError(data.error ?? "Registration failed")
    }
  }

  return (
    <>
      {/* Header */}
      <div className={`max-w-screen px-6 py-4 flex items-center justify-between bg-black`}>
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 text-white/90 hover:text-white font-semibold tracking-tight rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <Image src="/logo.svg" alt="Logo" width={28} height={28} />
          ESG Questionnaire
        </Link>
      </div>

      {/* Register Form */}
      <main className="min-h-[calc(100vh-60px)] flex items-center justify-center p-4 bg-black text-white">
        <Card className="w-full max-w-md bg-neutral-900 text-white border-neutral-800">
          <CardHeader>
            <CardTitle className="text-pretty">Create your account</CardTitle>
            <CardDescription>
              Register to start filling your ESG questionnaire.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={onSubmit} className="space-y-4">
              {error && <p className="text-sm text-red-400">{error}</p>}

              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              {/* Password with Eye toggle */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pr-10" // padding for eye button
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between gap-2">
                <Button type="submit" className="bg-teal-800 hover:bg-teal-700 hover:cursor-pointer">
                  Sign up
                </Button>
                <Button
                  type="button"
                  className="bg-white text-black hover:bg-white hover:text-black hover:cursor-pointer"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  )
}