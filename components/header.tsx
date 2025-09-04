"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions/auth"
import Image from "next/image"

export default function Header({
  hideNav = false,
  currentPath,
  token,
  user,
}: {
  hideNav?: boolean
  currentPath?: string
  token?: string | null
  user?: { name?: string }
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-20 p-2 md:p-6">
      <div
        className={`max-w-full px-1 md:px-2 py-0 flex items-center${token && !hideNav ? " justify-between" : ""
          }`}
      >
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 text-white/90 hover:text-white font-semibold tracking-tight rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <Image src="/logo.svg" alt="Logo" width={28} height={28} />
          <span className="text-xs sm:text-lg md:text-xl">
            ESG Questionnaire
          </span>
        </Link>

        {token && !hideNav && (
          <nav className="flex items-center gap-3 ml-auto">
            {/* 👇 Show logged-in user name */}
            {user?.name && (
              <span className="text-white font-medium">
                Hi, {user.name}
              </span>
            )}

            {currentPath !== "/dashboard" && (
              <Link
                href="/dashboard"
                className="text-xs md:text-sm text-white bg-teal-600 p-2 rounded-md hover:bg-teal-700 hover:cursor-pointer"
              >
                Dashboard
              </Link>
            )}

            <form action={logout} className="pointer-events-auto">
              <Button
                className="bg-white text-black hover:bg-white hover:text-black hover:cursor-pointer"
                type="submit"
              >
                Logout
              </Button>
            </form>
          </nav>
        )}
      </div>
    </header>
  )
}