import Header from "@/components/header"
import ESGForm from "@/components/esg-form"
import { getUserFromRequest } from "@/lib/auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function ESGFormPage() {
    const user = await getUserFromRequest()
    if (!user) redirect("/login")

    const token = (await cookies()).get("token")?.value || null
    const fiscalYear = new Date().getFullYear()

    return (
        <>
            <Header currentPath="/esg-form" token={token} user={user} />
            <main className="max-w-full px-4 md:px-10 pt-20 bg-black text-white">
                <ESGForm initialYear={fiscalYear} />
            </main>
        </>
    )
}