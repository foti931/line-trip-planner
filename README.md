# LINE Trip Planner

LINEで共有しやすい旅行予定とTODO管理のMVPです。LIFF上で動く静的Webアプリとして作っているため、まずはバックエンドなしで試せます。

## できること

- 旅行名、期間、メモの編集
- 旅程の追加、表示、削除
- TODOの担当者、期限、完了チェック
- TODO進捗率の表示
- 旅行概要のコピー
- JSONバックアップと復元
- LIFFプロフィール取得
- LINE Share Target Pickerによる共有
- Supabase設定時の共有DB保存

## 試し方

ローカルで確認する場合は、このディレクトリで簡易HTTPサーバーを起動します。

```sh
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080` を開くと使えます。

LIFFで使う場合は、LIFFアプリのエンドポイントにこのWebアプリのURLを設定してください。現在は次のLIFF IDを既定値として設定済みです。

```text
2011148240-H74Owj2K
```

LIFF URL:

```text
https://liff.line.me/2011148240-H74Owj2K
```

## 構成

```text
.
├── index.html
├── styles.css
├── app.js
├── config.js
├── config.example.js
├── supabase-schema.sql
└── README.md
```

## 共有DB設定

複数人で同じ旅行データを編集する場合は、Supabaseでテーブルを作ってから `config.js` に設定を入れます。

1. Supabaseで新規プロジェクトを作成
2. SQL Editorで `supabase-schema.sql` を実行
3. Project Settings → API から Project URL と anon public key を確認
4. `config.js` を更新

```js
window.LINE_TRIP_PLANNER_CONFIG = {
  SUPABASE_URL: "https://YOUR_PROJECT_ID.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",
  DEFAULT_TRIP_ID: "main-trip"
};
```

同じ `trip` を付けたURLを開いた人は同じ旅行データを共有します。

```text
https://liff.line.me/2011148240-H74Owj2K?trip=okinawa-2026
```

LINEグループ連携では、BotのWebhookで取得した `groupId` を `trip` に使う想定です。

## 現時点の仕様

Supabase未設定時はブラウザの `localStorage` に保存されます。Supabase設定時は共有DBへ保存し、数秒ごとに他端末の変更を取り込みます。

次の段階では、Messaging APIのWebhookサーバーを追加して、LINEグループIDごとの旅行ページ発行や通知を実装できます。
