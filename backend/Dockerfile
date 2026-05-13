# ベースイメージ：Python 3.12のslim（軽量Linux）
FROM python:3.12-slim

# コンテナ内の作業ディレクトリを指定
WORKDIR /app

# 依存関係ファイルだけ先にコピー（キャッシュ効率化のため）
COPY requirements.txt .

# Pythonパッケージをインストール
RUN pip install --no-cache-dir -r requirements.txt

# ソースコードをコピー
COPY . .

# 開発サーバーを起動（ポート5000）
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000", "--debug"]