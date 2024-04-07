export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return <section className="text-center">
        <nav>home layout</nav>
        {children}
    </section>
}
