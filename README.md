# nico downloader

nico downloaderはニコニコ用のシンプルなChrome拡張です。

## コンセプト
- 動画ページでの保存リンクの自動作成
- 保存リンクからの高速保存
- シンプルな機能とある程度のカスタマイズ性の両立

## しくみ
1. 動画ページのhtml内にURLがあるので、そのURLを抽出しそのデータをキャッシュ
2. 同様に、動画のタイトルを抽出しそのデータをキャッシュ
3. キャッシュされたデータをblobとして取得し、そのURLをリンクとして表示
4. すでにblobになっているのでディスクに書き込めばすぐ保存終了

## 今後追加予定の機能
- ffmpeg.wasmを用いた自動変換機能
