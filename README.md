# Next.js ブログ自動生成ツール

このリポジトリは、Next.js と TypeScript をベースにしたブログアプリケーションです。OpenAI API を使って毎日自動で Markdown 記事を生成し、GitHub Actions を通じてスケジュール実行と公開までを一貫して自動化します。

---

## 主な機能

* **Next.js**（TypeScript）を利用したモダンなブログ構成
* **MDX** で記事執筆・管理（`posts/*.md`）
* **OpenAI** SDK を通じた AI 記事自動生成スクリプト（`scripts/generate-post.ts`）
* **ユーティリティ関数** によるプロンプト・FrontMatter 出力の整理（`scripts/utils/`）
* **GitHub Actions** で毎日定刻に生成→コミット→プッシュを自動実行（`.github/workflows/auto-generate.yml`）

---

## 目次

1. [前提条件](#前提条件)
2. [インストール](#インストール)
3. [ローカル開発](#ローカル開発)
4. [記事生成](#記事生成)

   * [手動実行](#手動実行)
   * [自動実行 (CI)](#自動実行-ci)
5. [フォルダ構成](#フォルダ構成)
6. [利用可能なスクリプト](#利用可能なスクリプト)
7. [コントリビューション](#コントリビューション)
8. [ライセンス](#ライセンス)

---

## 前提条件

* Node.js v18 以上
* npm または yarn
* OpenAI API キー（`.env.local` に設定）

---

## インストール

```bash
git clone https://github.com/momonga0714/nextjs-blog.git
cd nextjs-blog
npm ci
```

プロジェクトルートに `.env.local` を作成し、以下を追加してください：

```ini
OPENAI_API_KEY=あなたの_API_KEY
OPENAI_MODEL=gpt-4
```

---

## ローカル開発

Next.js の開発サーバーを起動します：

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

---

## 記事生成

### 手動実行

AI を利用した記事生成スクリプトを手動で動かすには：

```bash
npm run generate
```

このコマンドは `ts-node` で `scripts/generate-post.ts` を実行し、以下を行います：

1. 今日のテーマと昨日の記事を判定
2. OpenAI に渡すプロンプトを組み立て（先頭 H1 を除去）
3. `posts/` に Markdown ファイルを出力（FrontMatter 付き）

### 自動実行 (CI)

GitHub Actions ワークフロー（`.github/workflows/auto-generate.yml`）で毎日定刻に以下を実行します：

1. リポジトリのチェックアウト
2. 依存関係のインストール
3. `npm run generate` の実行
4. 生成された記事をコミット & プッシュ

---

## フォルダ構成

```
nextjs-blog/
├── .github/
│   └── workflows/           # GitHub Actions 設定
├── pages/                   # Next.js ページコンポーネント
├── posts/                   # 自動生成された Markdown 記事
├── public/                  # 静的ファイル
├── scripts/
│   ├── generate-post.ts     # 記事生成メインスクリプト
│   └── utils/               # プロンプト・FrontMatter 生成ユーティリティ
├── styles/                  # グローバル CSS
├── tsconfig.json            # TypeScript 設定
├── next.config.ts           # Next.js 設定
└── package.json             # スクリプト & 依存定義
```

---

## 利用可能なスクリプト

| コマンド               | 説明                      |
| ------------------ | ----------------------- |
| `npm run dev`      | 開発モードで Next.js を起動      |
| `npm run build`    | 本番用ビルドの作成               |
| `npm run start`    | 本番モードで起動                |
| `npm run lint`     | ESLint を実行              |
| `npm run generate` | AI で記事を生成し `posts/` へ出力 |

---

## コントリビューション

バグ報告や機能要望、プルリクエストは大歓迎です。Issue を立てるか、Pull Request をお送りください。

---

## ライセンス

このプロジェクトは [MIT ライセンス](LICENSE) の下で公開されています。
