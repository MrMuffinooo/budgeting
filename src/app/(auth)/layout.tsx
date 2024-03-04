export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      LAYOUT AUTH
      <nav></nav>
      {children}
    </section>
  );
}
