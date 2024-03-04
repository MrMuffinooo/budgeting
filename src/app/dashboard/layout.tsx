export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      LAYOUT DASHBOARD
      <nav></nav>
      {children}
    </section>
  );
}
