import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useListProjects } from "@/api/generated/hooks";
import type { ProjectResponse } from "@/api/generated/models";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

const columnHelper = createColumnHelper<ProjectResponse>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: "プロジェクト名",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("description", {
    header: "概要",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("created_at", {
    header: "作成日時",
    cell: (info) => info.getValue(),
  }),
];

function ProjectsPage() {
  const [enabled, setEnabled] = useState(false);

  const { data, isLoading, isError } = useListProjects({
    query: { enabled },
  });

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">プロジェクト一覧</h1>
        <p className="mt-2 text-muted-foreground">
          データベースに登録されたプロジェクトを表示します。
        </p>
      </div>

      {!enabled && (
        <button
          onClick={() => setEnabled(true)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          データを取得
        </button>
      )}

      {isLoading && (
        <p className="text-sm text-muted-foreground">読み込み中...</p>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          データの取得に失敗しました。
        </p>
      )}

      {data && (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b bg-muted/50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-medium text-muted-foreground"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2 text-xs text-muted-foreground border-t">
            {data.length} 件
          </div>
        </div>
      )}
    </div>
  );
}
