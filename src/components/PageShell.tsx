import AppHeader from "./AppHeader";

type PageShellProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  showHeader?: boolean;
};

export default function PageShell({
  title,
  subtitle,
  children,
  showHeader = true,
}: PageShellProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
        }}
      >
        {showHeader && <AppHeader />}

        {title && (
          <h1
            style={{
              fontSize: 28,
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            {title}
          </h1>
        )}

        {subtitle && (
          <p
            style={{
              marginTop: 0,
              marginBottom: 24,
              opacity: 0.7,
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}