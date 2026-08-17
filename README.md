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

## 試し方

ローカルで確認する場合は、このディレクトリで簡易HTTPサーバーを起動します。

```sh
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080` を開くと使えます。

LIFFで使う場合は、LIFFアプリのエンドポイントにこのWebアプリのURLを設定してください。LIFF IDをクエリ文字列で渡すと初期化します。

```text
https://example.com/?liffId=YOUR_LIFF_ID
```

## 構成

```text
.
├── index.html
├── styles.css
├── app.js
└── README.md
```

## 現時点の仕様

データはブラウザの `localStorage` に保存されます。複数人でのリアルタイム共同編集やLINE通知リマインドは未実装です。

次の段階では、Supabaseなどのバックエンドを追加して旅行データを共有し、Messaging APIで通知を送る構成に拡張できます。
