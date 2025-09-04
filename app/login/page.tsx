"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { z } from "zod"

const loginSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function submit() {
    setError(null)

    // ✅ Zod validation
    const validation = loginSchema.safeParse({ name, email, password })
    if (!validation.success) {
      setError(validation.error.errors[0].message)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed")
      }
      router.push("/dashboard")
    } catch (e: any) {
      setError(e.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="max-w-screen px-6 py-4 flex items-center justify-between bg-black">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 text-white/90 hover:text-white font-semibold tracking-tight rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <Image src="/logo.svg" alt="Logo" width={28} height={28} />
          ESG Questionnaire
        </Link>
      </div>

      <main className="min-h-[calc(100vh-60px)] flex items-center justify-center p-4 bg-black text-white">
        <Card className="w-full max-w-md bg-neutral-900 text-white border-neutral-800">
          <CardHeader>
            <CardTitle className="text-pretty">
              {mode === "login" ? "Sign in" : "Create your account"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Access your ESG questionnaire and saved responses."
                : "Register to start filling your ESG questionnaire."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mode === "register" && (
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your name"
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[30px] text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex items-center justify-between gap-2">
              <Button
                className="bg-teal-800 hover:bg-teal-700 hover:cursor-pointer"
                onClick={submit}
                disabled={loading}
              >
                {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
              </Button>
              <Button
                className="bg-white text-black hover:bg-white hover:text-black hover:cursor-pointer"
                onClick={() => router.push("/register")}
              >
                Create account
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}