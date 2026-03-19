export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-card p-8 rounded-2xl border border-border shadow-xl">
        {children}
      </div>
    </div>
  )
}
