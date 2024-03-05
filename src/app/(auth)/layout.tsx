import styles from "./layout.module.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <aside className={styles.aside}>ASIDE</aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
