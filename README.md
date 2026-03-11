# site-a-redesign

Park Homes Okinawa (サイトA) のフルリニューアル版ランディングページです。Cloudflare により直接 HTML を取得できなかったため、`https://r.jina.ai/https://www.parkhomes-okinawa.com/` のキャッシュからコンテンツ構成を分析し、沖縄のトレーラーハウス事業者としての強みを再整理しました。

## 特徴
- **レスポンシブ対応**: モバイル〜デスクトップまでシンプルな 1 ページ構成。
- **パフォーマンス最適化**: 画像はリモート参照にとどめ、CSS/JS を最小限に。`loading="lazy"` や `prefers-reduced-motion` に配慮。
- **コンテンツ再構成**: ヒーロー、バリュー、製品ラインアップ、導入事例、プロセス、FAQ、問い合わせ導線を再整理し、CTA を明確化。

## 開発・プレビュー
```bash
cd site-a-redesign
python3 -m http.server 5173
# もしくはお好みの静的サーバーで index.html を配信
```

## ディレクトリ構成
```
site-a-redesign/
├── ANALYSIS.md      # 現行サイトの所見
├── README.md        # このファイル
├── index.html       # メインページ
├── styles.css       # テーマ & レイアウト
└── scripts.js       # ナビゲーション等の軽量挙動
```

必要に応じて `assets/` 配下にローカル画像やアイコンを追加してください。
