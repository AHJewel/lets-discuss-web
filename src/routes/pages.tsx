function Placeholder({ title }: { title: string }) {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">{title}</h1>
    </main>
  )
}

export const LoginPage = () => <Placeholder title="Log in" />
export const DashboardPage = () => <Placeholder title="Dashboard" />
