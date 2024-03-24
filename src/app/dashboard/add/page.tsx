import styles from "./page.module.scss";

export default function AddExpence({}) {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div>
          <p>Add expence</p>
        </div>
        <div>
          <p>___ Currency</p>
        </div>
        <div>
          <p>Category</p>
        </div>
        <div>
          <p>Date</p>
        </div>
        <div>
          <p>Comment</p>
        </div>
      </div>
    </main>
  );
}
