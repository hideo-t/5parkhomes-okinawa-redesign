# site-a-redesign

Park Homes Okinawa (サイトA) のフルリニューアル版ランディングページです。Cloudflare で直接 HTML を取得できないため、`https://r.jina.ai/https://www.parkhomes-okinawa.com/` のキャッシュからコンテンツを収集し、`reference-site.md` に保存。既存の写真・説明文をすべてサイト内で再表示しています。

## 特徴
- **フルレスポンシブ / 沖縄テイスト**: コーラル×ターコイズの配色と波紋パターンで、既存写真との一体感を演出。
- **コンテンツアーカイブ**: `reference-site.md` を JS で読み込み、画像＆テキストを全件レンダリング。元サイトの情報を欠落なく閲覧可能。
- **将来の拡張プレースホルダ**:
  - チャットボット UI（固定 FAB + デモパネル）
  - 自動見積フォーム（価格計算＋ `window.print()` での印刷動線）
- **パフォーマンス配慮**: 遅延読み込み、軽量なカスタム Markdown パーサ、最小限の JS で Core Web Vitals を意識。

## セットアップ / プレビュー
```bash
cd site-a-redesign
python3 -m http.server 5173
# ブラウザで http://localhost:5173 を開きます
```

## 主なファイル
```
site-a-redesign/
├── ANALYSIS.md        # 旧サイト分析メモ
├── reference-site.md  # 旧サイトから取得した Markdown（全文・全画像）
├── index.html         # 新デザイン（チャット・見積・アーカイブ付き）
├── styles.css         # 沖縄テイストのテーマ & レイアウト
├── scripts.js         # ナビ、見積計算、チャット導線、Markdown描画
└── README.md          # このファイル
```

## 旧サイトデータの更新方法
1. `curl -sL https://r.jina.ai/https://www.parkhomes-okinawa.com/ > reference-site.md`
2. `git commit -am "chore: update archive"`
3. 必要に応じてプッシュ

`reference-site.md` の内容はページ読み込み時に自動で反映されます。
