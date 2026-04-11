interface PageShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function PageShell({ title, description, children }: PageShellProps) {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-3xl flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: 510,
              lineHeight: 1.1,
              letterSpacing: "-0.704px",
              color: "#f7f8f8",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 15,
              fontWeight: 400,
              lineHeight: 1.6,
              color: "#8a8f98",
              letterSpacing: "-0.165px",
              maxWidth: 480,
            }}
          >
            {description}
          </p>
        </div>

        {children}
      </div>
    </main>
  );
}
