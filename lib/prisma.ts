// Using a lazy getter lets the app run without @prisma/client in the v0 preview,
// while still supporting Prisma locally/production after `prisma generate`.

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: unknown | undefined
}

let _prisma: unknown | null = null

export async function getPrisma() {
  // Use a singleton to avoid exhausting DB connections during HMR
  if (_prisma) return _prisma

  try {
    const mod = await import("@prisma/client")
    const { PrismaClient } = mod as unknown as { PrismaClient: new (args?: any) => unknown }

    const client =
      (globalThis as any).prismaGlobal ??
      new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      })

    if (process.env.NODE_ENV !== "production") {
      ;(globalThis as any).prismaGlobal = client
    }

    _prisma = client
    return _prisma
  } catch (err: any) {
    // In the v0 preview, @prisma/client is not generated, so this import fails.
    // Provide a clear message and keep the app running (use Neon SQL paths).
    console.error("[v0] Prisma client import failed:", err?.message)
    throw new Error(
      "Prisma client isn't available in this preview. Run locally with: `npm i prisma @prisma/client && npx prisma generate`.",
    )
  }
}