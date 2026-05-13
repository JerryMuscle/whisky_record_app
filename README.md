# ウイスキー記録アプリ

## 開発環境のセットアップ

### 必要なもの
- Docker Desktop（インストール済み）

### 起動手順

**1. このリポジトリをクローン（またはフォルダをそのまま使う）**

**2. フロントエンド（Next.js）プロジェクトを作成**
```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd ..
```

**3. 全コンテナを起動**
```bash
docker compose up --build
```

**4. 動作確認**
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:5000/health
- DB接続確認: `docker compose exec db psql -U whisky_user -d whisky_db -c "\dt"`

### よく使うコマンド

```bash
# 起動
docker compose up

# バックグラウンドで起動
docker compose up -d

# 停止
docker compose down

# コンテナのログを確認
docker compose logs backend
docker compose logs frontend

# DBに直接接続
docker compose exec db psql -U whisky_user -d whisky_db

# Flaskコンテナの中に入る
docker compose exec backend bash

# 停止 + データも全部消す（やり直したいとき）
docker compose down -v
```

### フォルダ構成

```
whisky-app/
├── docker-compose.yml      # 3コンテナの設定
├── frontend/               # Next.js
│   ├── Dockerfile
│   └── ...（Next.jsのファイル群）
├── backend/                # Flask
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app.py
└── db/
    └── init.sql            # 初回起動時に自動実行されるスキーマ
```

### ポート一覧

| サービス | URL |
|---------|-----|
| フロントエンド（Next.js） | http://localhost:3000 |
| バックエンド（Flask） | http://localhost:5000 |
| DB（PostgreSQL） | localhost:5432 |
