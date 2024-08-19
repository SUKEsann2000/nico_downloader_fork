
class NicoDownloaderClass {
    constructor() {
        this.MatchingSMIDArray = ""; // smIDの正規表現
        this.MatchingSMIDArraFirstSetting();
        this.VideoDownloadNameArray = ""; // 動画の保存名の設定
        this.VideoDownloadNameArraySetting();


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
        }
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


}