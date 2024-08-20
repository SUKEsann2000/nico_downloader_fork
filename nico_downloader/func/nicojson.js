// Description: ニコニコ動画のjsonを取得し中身のデータを抽出する関数をまとめたクラスです。
//使い方
/*
const nicovideo = new Nicovideo();
nicovideo.SetAllFromVideoSm('sm9').then(() => {
    console.log(nicovideo.view_count);
    console.log(nicovideo.comment_count);
    console.log(nicovideo.mylist_count);
    console.log(nicovideo.like_count);
    console.log(nicovideo.title);
});
*/

// 必要な変数
const NicoVideoWatchURL = 'https://www.nicovideo.jp/watch/';


class NicovideoClass {
    constructor() {
        this.video_sm = ''; // 動画id
        this.json = {}; // json
        this.view_count = 0; // 再生数
        this.comment_count = 0; // コメント数
        this.mylist_count = 0; // マイリスト数
        this.like_count = 0; // いいね数
        this.video_title = ''; // タイトル

        //後で自ら設定しないといけない変数
        this.video_name = "";// 動画の保存名
    }

    //jsonをダウンロード後jsonをセットし、その後各変数をセット
    async SetAllFromVideoSm(video_sm) {
        this.video_sm = video_sm;
        return this.DownloadJson(video_sm)
            .then(json => {
                this.SetJson(json);
                this.SetAll();
            });
    }

    //jsonをダウンロード
    async DownloadJson(video_sm = this.video_sm) {
        const url = NicoVideoWatchURL + video_sm + '?responseType=json';
        return fetch(url).then(response => response.json());
    }
    //jsonをセット
    SetJson(json) {
        this.json = json;
    }
    //constructorの各変数をセット
    SetAll(json = this.json) {
        this.view_count = this.JsonToViewCount(json);
        this.comment_count = this.JsonToCommentCount(json);
        this.mylist_count = this.JsonToMylistCount(json);
        this.like_count = this.JsonToLikeCount(json);
        this.video_title = this.JsonToTitle(json);
    }

    //jsonより再生数を取得
    JsonToViewCount(json = this.json) {
        return json.data.response.video.count.view;// 再生数
    }
    //jsonよりコメント数を取得
    JsonToCommentCount(json = this.json) {
        return json.data.response.video.count.comment;// コメント数
    }
    //jsonよりマイリスト数を取得
    JsonToMylistCount(json = this.json) {
        return json.data.response.video.count.mylist;// マイリスト数
    }
    //jsonよりいいね数を取得
    JsonToLikeCount(json = this.json) {
        return json.data.response.video.count.like; // いいね数
    }
    //jsonよりタイトルを取得
    JsonToTitle(json = this.json) {
        return json.data.response.video.title; // タイトル
    }
    //jsonよりidを取得
    JsonToId(json = this.json) {
        return json.data.response.video.id; // id
    }

    //変数の中身が適正なデータかチェックする関数
    //video_smが空文字ならfalseを返す
    Checkvideo_sm() {
        if (this.video_sm == '') return false;
        true;
    }
    Checkvideo_title() {
        if (this.video_title == '') return false;
        true;
    }

}