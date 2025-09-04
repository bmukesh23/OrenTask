import Header from "@/components/header"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <>
      <Header hideNav />
      <main className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_35%,rgba(34,197,94,0.28),rgba(0,0,0,0)_70%)]"
        />
        <section className="relative z-10 grid gap-6 place-items-center text-center px-6">
          <h1 className="text-balance text-4xl md:text-6xl font-semibold">Simple ESG Questionnaire</h1>
          <p className="text-gray-300 max-w-2xl">
            Capture ESG metrics by financial year. Auto-calculated KPIs update in real time. View summaries and export
            to Excel.
          </p>
          <div>
            <Link href="/login">
              <Button className="bg-emerald-500 text-black hover:bg-emerald-400 hover:cursor-pointer">Get started</Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}