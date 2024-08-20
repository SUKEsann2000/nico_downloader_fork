//めっちゃ重要なデータ
/* 
    VideoData
    VideoData.Video_title : 動画のタイトルのクラス名
    VideoData.Video_title_Element : タイトルの場所のクエリで、ボタンを追加する場所
    VideoData.Video_DLlink : ボタンの内部構造のクエリ
    VideoData.SystemMessageContainer : SystemMessageのクエリ
    VideoData.PlayerSettingQuery : 設定ボタンのクエリ
    VideoData.PlayerSettingClass : 設定ボタンのクラス名
    VideoData.SystemMessageClass : SystemMessageのクラス名
    VideoData.SystemMessageQuery : SystemMessageのクエリ
    VideoData.DLButton : ダウンロードボタンのCSSとかHTML
    VideoData.DLButton.a : ダウンロードボタンのHTMLの前半
    VideoData.DLButton.b : ダウンロードボタンのHTMLの中身
    VideoData.DLButton.c : ダウンロードボタンのHTMLの後半

*/

const VideoData = {
    // 動画のタイトルのクラス名
    Video_title: 'fs_xl fw_bold',

    // タイトルの場所のクエリで、ボタンを追加する場所
    Video_title_Element: 'd_flex justify_space-between items_flex-start gap_x3 w_100%',
    //Video_title_Element: 'd_flex w_[268px] gap_base items_center',

    //ボタンの内部構造のクエリ
    Video_DLlink: {
        p: 'Dlink',
        div_class: 'd_flex justify_flex-start',
        a: 'DLlink_a',
        li: 'DLlink_li',
        a2: 'downloadlink'
    },

    // SystemMessageのクエリ
    SystemMessageContainer: 'text_monotone.L80',

    // 設定ボタンのクエリ
    PlayerSettingQuery: '[aria-label="設定"]',

    // 設定ボタンのクラス名
    PlayerSettingClass: 'h_[calc(100vh_-_{sizes.commonHeader.inViewHeight}_-_{sizes.webHeader.height}_-_{spacing.x12})] max-h_[480px] rounded_m bg_layer.surfaceHighEm d_flex flex_column overflow_hidden shadow_base',

    // SystemMessageのクラス名
    SystemMessageClass: 'cursor_pointer d_inline-flex items_center justify_center gap_x0_5 px_x2 rounded_full fs_s fw_bold button-color_base white-space_nowrap select_none hover:cursor_pointer disabled:pointer-events_none [&_>_svg]:w_auto [&_>_svg]:h_x3 h_x3 [&_svg]:d_none',

    // SystemMessageのクエリ
    SystemMessageQuery: '[class^="cursor_pointer d_inline-flex items_center justify_center gap_x0_5 px_x2 rounded_full fs_s fw_bold button-color_base white-space_nowrap select_none hover:cursor_pointer disabled:pointer-events_none"]',

    // ダウンロードボタンのCSSとかHTML
    DLButton: {
        a: "<button style='width:200px;height:56px;color: var(--colors-action-text-on-tertiary-azure);background-color: var(--colors-action-base);border-radius: var(--radii-m)'",
        b: '"\'><b>',
        c: '</b>'
    }

}


class NicoDownloaderClass {

    //多言語対応
    Lang = {
        "ja": {
            "処理開始": "処理開始",
            "MainVideoPlayerが読み込めません": "MainVideoPlayerが読み込めません",
            "要初期設定": "nico downloaderの初期設定を行ってください",
            "設定画面を開く": "設定画面を開く",
            "を保存": "を保存",
            "処理中": "処理中",
        }
    }

    constructor() {
        this.MatchingSMIDArray = ""; // smIDの正規表現
        this.MatchingSMIDArraFirstSetting();
        this.VideoDownloadNameArray = ""; // 動画の保存名の設定
        this.VideoDownloadNameArraySetting();
        this.Savemode == "0"; // 保存モード
        this.SavemodeSetting(); // 保存モードの設定
        this.optionURL = chrome.runtime.getURL('options.html');// オプションページのURL


        //後で自ら設定しないといけない変数
        this.LoadedVideoSMID = "-1"; // 読み込んだ動画のsmID
        this.LangSetting = "ja"; // 言語

    }
    //設定ファイルを読み込む
    MatchingSMIDArraFirstSetting() {
        try {

            this.MatchingSMIDArray = setOption("video_pattern");
            if (this.MatchingSMIDArray == "0") {
                this.MatchingSMIDArray = "sm[0-9]{1,}";
            }
        } catch (error) {
            this.MatchingSMIDArray = "sm[0-9]{1,}";
            DebugPrint("NicoDownloaderClass:ERROR:" + error)
            return false;
        }
        return true;
    }


    VideoDownloadNameArraySetting() {
        const Setting = setOption("video_downloading");
        /*
            Setting
            0:smID
            1:title
            2:smID_title
            3:title_smID
        */
        switch (Setting) {
            case "0":
                this.VideoDownloadNameArray = "${NicoDownloaderClasssmID}";
                break;
            case "1":
                this.VideoDownloadNameArray = "${NicoDownloaderClasstitle}";
                break;
            case "2":
                this.VideoDownloadNameArray = "${NicoDownloaderClasssmID}_${NicoDownloaderClasstitle}";
                break;
            case "3":
                this.VideoDownloadNameArray = "${NicoDownloaderClasstitle}_${NicoDownloaderClasssmID}";
                break;
            default:
                this.VideoDownloadNameArray = "${NicoDownloaderClasssmID}";
                break;
        }
        return;
    }

    //動画のダウンロード名を作成
    VideoDownloadNameMake(video_smID, video_title, video_type = "mp4") {
        let ret = this.VideoDownloadNameArray;
        ret = ret.replace("${NicoDownloaderClasssmID}", video_smID);
        ret = ret.replace("${NicoDownloaderClasstitle}", video_title);

        //拡張子をつける
        ret = ret + "." + video_type;
        return ret;
    }



    //この関数はすでに作ったリンクがあるかどうかを判別する
    VideoTitleElementCheck(video_sm) {
        if (this.LoadedVideoSMID !== video_sm && this.LoadedVideoSMID !== "-1") {
            DebugPrint("this.LoadedVideoSMIDリセット")
            DebugPrint("this.LoadedVideoSMID : " + this.LoadedVideoSMID)
            DebugPrint("video_sm : " + video_sm)
            //this.LoadedVideoSMIDが現在のものと同じじゃないならすでに読み込んだ形跡があるので一回消す
            this.LoadedVideoSMID = "-1";// リセット
            document.getElementById(VideoData.Video_DLlink.p).remove();//消す
        }
        return;
    }

    //読み込み済みの動画をセットする
    VideoLoadedSet(video_sm) {
        this.LoadedVideoSMID = video_sm;
        return;
    }

    //この関数はすでに動画を読み込んだかどうかを判別する
    VideoLoadedCheck(video_sm) {
        if (this.LoadedVideoSMID === video_sm) {
            return true;//すでに読み込んでいる
        }
        return false;//読み込んでいない
    }



    //リンクの作成をする
    VideoTitleElementFirstMake() {

        let p_link = document.createElement("p");
        p_link.id = VideoData.Video_DLlink.p;
        p_link.className = VideoData.Video_DLlink.div_class;
        let a_link = document.createElement("a");
        a_link.innerText = "処理中";
        a_link.id = VideoData.Video_DLlink.a;

        //すでにあるなら追加しない
        if (!document.getElementById(p_link.id)) {
            document.getElementsByClassName(VideoData.Video_title_Element)[0].appendChild(p_link);
            document.getElementsByClassName(VideoData.Video_title_Element)[0].querySelector("p").appendChild(a_link);
        }

        return;
    }

    //ボタンに文字を書き込む
    ButtonTextWrite(text) {
        // 多言語対応
        document.getElementById(VideoData.Video_DLlink.a).innerHTML = VideoData.DLButton.a + VideoData.DLButton.b + this.LangText(text) + VideoData.DLButton.c;
        return;
    }

    //ボタンのinnerHTMLを書き換える
    ButtonInnerHTMLWrite(innerHTML) {
        document.getElementById(VideoData.Video_DLlink.a).innerHTML = innerHTML;
        return;
    }

    //多言語対応
    LangSetting(lang) {
        this.LangSetting = lang;
        return;
    }

    //多言語対応のための関数
    LangText(text) {
        return this.Lang[this.LangSetting][text] || text;
    }

    //MainVideoPlayerが読み込めるかどうかを判別する
    CheckMainVideoPlayer() {
        if (document.querySelector("video").getAttribute('src') == null) {
            return false;
        }
        return true;
    }

    //SystemMessageが読み込めるかどうかを判別する
    CheckSystemMessageContainer() {
        if (document.getElementsByClassName(VideoData.SystemMessageContainer).length == 0) {
            return false;
        }

        return true;
    }

    // Savemodeの読み込み
    SavemodeSetting() {
        this.Savemode = setOption("video_hlssave");
        return;
    }

    _SystemMessageAutoOpen() {//実際には使わないが、この関数を参考にSystemMessageAutoOpenToText()を作る

        new Promise((resolve) => {
            //プレーヤー設定を自動的に押す
            document.querySelector(VideoData.PlayerSettingQuery).click();
            resolve();
        }).then(function () {
            //システムメッセージを開く
            document.querySelector(VideoData.SystemMessageQuery).click();
        })
    }

    //SystemMessageのテキスト版を作成
    SystemMessgeAutoOpenToText() {
        let text = ""
        text += "new Promise(function(resolve) {document.querySelector(&#39;" + VideoData.PlayerSettingQuery + "&#39;).click();resolve();})";
        text += ".then(function() {document.querySelector(&#39;" + VideoData.SystemMessageQuery + "&#39;).click();});";
        return text;
    }

    //保存ボタンの中身を作成
    SaveButtonInnerHTMLMake(video_name) {
        if (this.Savemode == "0") {
            // 初期設定を促す
            return VideoData.DLButton.a + " onclick=\'location.href=&quot;" + this.optionURL + "&quot;\' " + VideoData.DLButton.b + this.LangText("要初期設定") + "<a href=\"" + this.optionURL + "\"><br>" + this.LangText("設定画面を開く") + "</a>" + VideoData.DLButton.c;
        }

        return VideoData.DLButton.a + " onclick=\'" + SystemMessgeAutoOpen_Text() + "\' " + VideoData.DLButton.b + video_name + this.LangText("を保存") + VideoData.DLButton.c + "</p>";
    }

    //保存ボタンを作成
    SaveButtonMake(video_name) {
        const innerHTML = this.SaveButtonInnerHTMLMake(video_name);
        this.ButtonInnerHTMLWrite(innerHTML);
        return;
    }

    //nico downloaderの初期設定していなかったら止める
    NicoDownloaderFirstSettingCheck() {
        if (document.getElementById(VideoData.Video_DLlink.a).innerHTML.indexOf(this.LangText("要初期設定")) != -1) {
            return false;
        }
        return true;
    }


}