# ベースイメージ：Node.js 20のAlpine（軽量Linux）
FROM node:20-alpine

# コンテナ内の作業ディレクトリを指定
WORKDIR /app

# 依存関係ファイルだけ先にコピー（キャッシュ効率化のため）
COPY package*.json ./

# 依存パッケージをインストール
RUN npm install

# ソースコードをコピー
COPY . .

# 開発サーバーを起動（ポート3000）
CMD ["npm", "run", "dev"]