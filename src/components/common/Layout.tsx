import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div
      className="min-h-screen text-turquoise"
      style={{ fontFamily: "Inter, Poppins, sans-serif" }}
    >
      <header className="px-6 py-4">
        {/* Header content can be extended later if needed */}
      </header>
      <main className="px-6">{children}</main>
      <footer className="px-6 py-10 text-center text-turquoise/50">
        <span>LifeSync © {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};
