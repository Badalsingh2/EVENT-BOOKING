// app/(auth)/layout.tsx
import Layout from '@/components/layout'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Layout>
      <div className="min-h-screen">
        {children}
      </div>
    </Layout>
  )
}