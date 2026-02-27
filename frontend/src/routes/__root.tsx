import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-14 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight">Rustruct</span>
          </Link>
          <nav className="ml-8 flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className="transition-colors hover:text-foreground/80 [&.active]:text-foreground text-foreground/60"
            >
              計算ツール
            </Link>
            <Link
              to="/projects"
              className="transition-colors hover:text-foreground/80 [&.active]:text-foreground text-foreground/60"
            >
              プロジェクト
            </Link>
          </nav>
        </div>
      </header>
      <main className="container py-8">
        <Outlet />
      </main>
    </div>
  );
}
