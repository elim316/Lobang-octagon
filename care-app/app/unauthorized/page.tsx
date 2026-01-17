export default function UnauthorizedPage() {
  return (
    <div style={{ maxWidth: 520, margin: "80px auto", padding: 16 }}>
      <h1>Unauthorized</h1>
      <p>You do not have access to this page.</p>
      <a href="/app">Go to home</a>
    </div>
  );
}
