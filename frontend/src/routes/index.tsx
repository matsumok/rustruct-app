import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">計算ツール一覧</h1>
        <p className="mt-2 text-muted-foreground">
          建築構造設計向けの計算ツールを提供しています。
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="font-semibold">ツールは近日追加予定</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            現在、各種計算ツールを開発中です。しばらくお待ちください。
          </p>
        </div>
      </div>
    </div>
  );
}
