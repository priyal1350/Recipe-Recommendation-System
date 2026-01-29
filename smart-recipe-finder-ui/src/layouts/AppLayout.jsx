export default function AppLayout({ children }) {
  return (
    <div style={styles.page}>
      {children}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "20px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
};
