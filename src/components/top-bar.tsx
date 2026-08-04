import styles from "./top-bar.module.css";

export default function TopBar() {
  return (
    <header className={styles.topBar}>
      <span className={styles.appName}>creative hub</span>
    </header>
  );
}
