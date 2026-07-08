import Link from "next/link";

// Global fallback for routes outside the locale tree (rare). Renders its own
// document because there is no shared root layout above [locale].
export default function GlobalNotFound() {
  return (
    <html lang="ka">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0E1526",
          color: "#F4F6FB",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 48, margin: 0, color: "#FF6B3D" }}>404</h1>
          <p style={{ opacity: 0.7 }}>Page not found</p>
          <Link href="/" style={{ color: "#FF6B3D" }}>
            codeless.ge
          </Link>
        </div>
      </body>
    </html>
  );
}
