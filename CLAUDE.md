# Rustruct - CLAUDE.md

日本の建築構造設計向け計算ツール集Webアプリ。

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| Backend | Rust + Axum 0.7 + utoipa 4 + SeaORM 1 + PostgreSQL 16 |
| Frontend | React 18 + TypeScript 5 + Vite 5 |
| UIコンポーネント | shadcn/ui + Tailwind CSS 3 |
| ルーティング | TanStack Router v1（ファイルベース自動生成） |
| データフェッチ | TanStack Query v5 |
| 型共有 | utoipa → `/api/openapi.json` → orval 7 → TanStack Query hooks |
| インフラ | Docker + Portainer (TrueNAS Scale) + Cloudflare Tunnel |

---

## プロジェクト構造

```
rustruct-app/
├── backend/                      # Rust ワークスペースルート
│   ├── Cargo.toml                # workspace members: [".", "migration"]
│   ├── src/
│   │   ├── main.rs               # Axumサーバー、OpenAPI、CORS設定
│   │   └── api/
│   │       ├── mod.rs
│   │       └── health.rs         # GET /api/health
│   ├── migration/                # sea-orm-migration クレート
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── main.rs           # cargo run -p migration -- up
│   │       └── m20240101_000001_create_example.rs
│   └── Dockerfile                # rust:alpine → alpine:3.19 マルチステージ
├── frontend/
│   ├── package.json
│   ├── vite.config.ts            # /api/* → localhost:3001 プロキシ
│   ├── orval.config.ts           # openapi.json → src/api/generated/
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── main.tsx              # QueryClientProvider + RouterProvider
│   │   ├── index.css             # shadcn/ui CSS変数 + Tailwind
│   │   ├── routeTree.gen.ts      # TanStack Router自動生成（.gitignore対象）
│   │   ├── routes/
│   │   │   ├── __root.tsx        # ヘッダーナビゲーション付きレイアウト
│   │   │   └── index.tsx         # ツール一覧プレースホルダー
│   │   └── api/
│   │       ├── axios-instance.ts # orval用カスタムAxiosインスタンス
│   │       └── generated/        # orval生成ファイル（.gitignore対象）
│   ├── nginx.conf                # SPA対応 + /api/ → backend プロキシ
│   └── Dockerfile                # node:22-alpine → nginx:alpine マルチステージ
├── docker-compose.yml            # 本番: postgres + backend + frontend
├── docker-compose.dev.yml        # 開発: postgres のみ（port 5432公開）
├── .env.example
└── .gitignore
```

---

## ポート

| サービス | ポート |
|---|---|
| Backend (dev) | `localhost:3001` |
| Frontend (Vite dev) | `localhost:5173` |
| Frontend (Docker nginx) | `localhost:8080` |
| PostgreSQL | `localhost:5432` |

---

## ローカル開発ワークフロー

```bash
# 1. PostgreSQL起動
docker compose -f docker-compose.dev.yml up -d

# 2. マイグレーション実行
cd backend && cargo run -p migration -- up

# 3. バックエンド起動
cargo run

# 4. TS型・Queryフック生成（バックエンド起動中に実行）
cd frontend && npm run orval

# 5. フロントエンド起動
npm run dev
```

---

## 主要エンドポイント

| URL | 内容 |
|---|---|
| `GET /api/health` | ヘルスチェック → `{"status":"ok"}` |
| `GET /api/openapi.json` | OpenAPI仕様JSON |
| `GET /api/docs` | Swagger UI |

---

## OpenAPI / orval の流儀

- **新しいAPIエンドポイントを追加するたびに必ず行うこと：**
  1. `backend/src/api/` に handler を追加
  2. `#[utoipa::path(...)]` マクロをアノテート
  3. `main.rs` の `#[derive(OpenApi)]` に `paths(...)` と `components(schemas(...))` を追加
  4. `cargo run` でバックエンド再起動
  5. `cd frontend && npm run orval` でフック再生成

- `components(schemas(...))` の登録を忘れると orval が `MissingPointerError` を出す

---

## Docker本番ビルドの注意点

- `backend/Dockerfile`: `rust:alpine`（バージョン固定しない。Cargo.lock v4はRust 1.78+が必要）
- `backend/Dockerfile`: `curl` が必要（`utoipa-swagger-ui` のビルド時にSwagger UIをダウンロードするため）
- `frontend/Dockerfile`: `node:22-alpine`（orval v7 は Node >= 22 が必要）

---

## 本番デプロイ（Portainer）

1. Portainer → Stacks → Add stack → Repository: `https://github.com/matsumok/rustruct-app`
2. Environment variables:
   - `POSTGRES_PASSWORD=<強いパスワード>`
   - `RUST_LOG=info`
3. Cloudflare Tunnel ingress: `http://localhost:8080`

`DATABASE_URL` は Portainer 側での設定不要（`docker-compose.yml` 内でコンテナ間名前解決を使用）。

---

## .gitignore 対象（自動生成ファイル）

- `frontend/src/routeTree.gen.ts` — TanStack Router Viteプラグインが `npm run dev` / `npm run build` 時に再生成
- `frontend/src/api/generated/` — orval が `npm run orval` 時に再生成
- `backend/target/` — Rustビルド成果物
- `frontend/node_modules/`, `frontend/dist/`
