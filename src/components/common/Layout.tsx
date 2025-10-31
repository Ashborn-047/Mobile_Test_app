import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div
      className="min-h-screen text-turquoise flex flex-col"
      style={{ fontFamily: "Inter, Poppins, sans-serif" }}
    >
      <header className="px-6 py-4 sm:px-8 md:px-16 lg:px-20">
        {/* Header content can be extended later if needed */}
      </header>
      <main className="flex-grow px-6 sm:px-8 md:px-16 lg:px-20 max-w-7xl mx-auto w-full">{children}</main>
      <footer className="px-6 py-10 text-center text-turquoise/50 sm:px-8 md:px-16 lg:px-20">
        <span>LifeSync © {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};
