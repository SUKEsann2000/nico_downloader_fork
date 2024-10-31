# nico downloader

nico downloader：ニコニコ用のシンプルなChrome拡張

---

- [nico downloader](#nico-downloader)
  - [コンセプト](#コンセプト)
  - [おことわりと怒りの表明](#おことわりと怒りの表明)
  - [要件](#要件)
  - [初期設定](#初期設定)
  - [使用方法](#使用方法)
  - [しくみ](#しくみ)
  - [QandAや要望](#qandaや要望)
  - [非常に雑なリリースノート](#非常に雑なリリースノート)


## コンセプト
- 動画ページでの保存ボタンの自動作成
- 動画結合処理の実装
- シンプルな機能とある程度のカスタマイズ性の両立

## おことわりと怒りの表明
1. 基本的にsm～以外の動画では動作しないようにしてあります
1. 一部の動画に暗号化されている動画がありますが、いろいろなところに抵触する為対応しません
1. 絶対に邪な使い方はしないで下さい
2. しょぼいスペックのPCではまず動きません　
   
## 要件
| 区分             | 数値                                                                 | 備考                                                                           |
| :--------------- | :------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| CPU              | AMD Ryzen Zen プロセッサより新しいプロセッサ                         |                                                                                |
| RAM              | 16GB以上                                                             | 16GB未満はサポート対象外<br>変換前にメモリ上に保存する関係でメモリを大量に使用 |
| OS               | Windows 11 23H2以上                                                  | Macintoshは一切の動作保証なし                                                  |
| 導入するブラウザ | Chrome最新版                                                         | Chrome以外はサポート対象外(特にEdge)                                           |
| 回線             | 100Mbps以上<br>nicovideo.jpへのpingやfetchの疎通が常にうまくいく環境 | これ未満でも動かないということはないが、自己責任でお願いします                 |


## 初期設定
1. Chromeの拡張機能の設定であったり、右上のボタンを押すなりしてオプションを開きます
2. 初期設定モードをOFFにします
3. 一番下の保存ボタンを押します
4. これで完了です

## 使用方法
1. 動画ページを開く
    1. 基本的にsm～から始まる動画のみサポート
    1. それ以外の動画は動作サポート対象外
1. 2秒くらい待つ
1. 動画の右下あたりに「保存」ボタンが生成ささる
1. クリックされるとシステムメッセージが自動で開かさり処理開始される
    1. 開かれたシステムメッセージはすぐ閉じて大丈夫です
1. 処理は自動で行われる
    1. ffmpegが裏で処理を行っているので少々重いかもしれない
1. 保存ダイアログが出るか既定のフォルダに保存される
    1. ここはChromeの設定に依存するため注意を要する

## しくみ
1. 動画ページのシステムメッセージ内にHLSのURLがあるので、そのURLを抽出しそのデータをキャッシュ
1. 同様に、動画のタイトルを抽出しそのデータをキャッシュ
1. キャッシュされたデータをもとにCMAFとかを取得
1. 取得したデータをffmpeg.wasmで結合
1. 結合したデータをblobとして取得
1. すでにblobになっているのでディスクに書き込めばすぐ保存終了

## QandAや要望
| 質問                                                                                                   | 回答                                                                                                                                                                                                                                                                                                                                      |
| :----------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. 保存できる画質を設定できるようにしてほしい                                                          | ＜対応予定あり＞時間要します                                                                                                                                                                                                                                                                                                              |
| 2. 音声データを保存できるようにしてほしい                                                              | ＜対応予定あり＞時間要します                                                                                                                                                                                                                                                                                                              |
| 3. コメントをダウンロードできるようにしてほしい                                                        | ＜対応検討中＞                                                                                                                                                                                                                                                                                                                            |
| 4. ダウンロードしようとしたら1KBになりました。バグらささっていると思います。                           | 十中八九変換に失敗しています。<br>原因の一例<br>・PCのメモリが足りない(要件を読んで下さい)<br>・回線の問題でダウンロードに失敗した(要件を読んで下さい)<br>・動画が暗号化されている(おことわりを読んで下さい)<br>・動画が長すぎる(特に3時間以上)                                                                                           |
| 5. バグを発見した                                                                                      | Issuesを立ててください                                                                                                                                                                                                                                                                                                                    |
| 6. Plz, I've Question by ENG or other...                                                               | I understand "Japanese". But I can't understand enough ENG. ------ I'd confirmed that DeepL translation and Google Translate don't correctly translate the dialect I talk. These sentence is also likely to be incorrect. Therefore, if you and I use a translator, our intentions would may be conveyed incorrectly. So I can't respond. |
| 7. 多言語対応してほしい                                                                                | 一応多言語対応できる状態になっていますがそもそも正しい翻訳なのかかなり怪しい状況です                                                                                                                                                                                                                                                      |
| 8. 「あ、　nico downloaderの現状、不具合、リリースノートなどはこちらから　のリンク先がなくなってます」 | 直しました。2024.9.16                                                                                                                                                                                                                                                                                                                     |

## 非常に雑なリリースノート
| バージョン名 | 日次       | アップデート項目                                             |
| ------------ | ---------- | ------------------------------------------------------------ |
| 1.0.0.0      | 覚えてない | リリース前バージョン　初作成                                 |
| 1.0.2.2      |            | リリース                                                     |
| 1.0.2.3      |            | リファクタリング及びバグの修正                               |
| 1.0.2.4      |            | デバッグモードの実装                                         |
| 1.1.0.0      |            | ニコニコ大百科用の機能追加                                   |
| 1.2.0.0      | 2022.3.14  | 自動保存モード追加<br>setOption修正                          |
| 1.2.0.1      | 2022.6.18  | nm番号のものがDLできなかった件修正                           |
| 2.0.0.0      | 2023.6.1   | HLSモード対応<br>外部のffmpeg.exeを使用したバージョン        |
| 3.0.0.0      | 2023.6.13  | HLSモードをffmpeg.wasmを使ったものに変更                     |
| 3.0.0.1      | 2023.6.18  | 修正                                                         |
| 3.0.0.2      | 2023.11.1  | ニコニコの突然のUI変更に対応                                 |
| 4.0.0.0      | 2023.12.3  | 大規模なリファクタリングにて再構築                           |
| 4.1.0.0      | 2024.8.5   | リファクタリング                                             |
| 5.0.0.0      | 2024.8.5   | 帰ってきたニコニコ対応                                       |
| 5.0.0.1      | 2024.8.7   | 保存時メモリを大量に使う問題に対処                           |
| 5.0.0.2      | 2024.8.7   | 二重ダウンロードされることがある問題に対処                   |
| 5.0.0.3      | 2024.8.10  | 初期設定モードの説明が変なことになっていたのを修正           |
| 5.0.0.4      | 2024.8.11  | リファクタリング                                             |
| 5.0.0.5      | 2024.8.11  | オプション画面を書き換え                                     |
| 5.0.0.6      | 2024.9.6   | 誤字修正、ニコニコの動画ページ変更追従                       |
| 5.0.0.7      | 2024.9.16  | 多言語対応の設定を追加<br>オプションページの変更             |
| 5.0.0.8      | 2024.9.17  | 保存された動画への一部メタタグの追加                         |
| 5.0.0.9      | 2024.9.23  | 軽微な修正                                                   |
| 5.0.0.10     | 2024.9.26  | 5.0.0.7へのロールバック                                      |
| 5.0.0.11     | 2024.9.27  | シリーズが存在しない動画の場合途中で落ちる現象の修正、微修正 |
| 5.0.0.13     | 2024.9.28  | 投稿者が存在しない動画への対処                               |