

//ダウンロード関数

async function VideoDown() {


    // 必要なクラスの初期化
    const NicoDownloader = new NicoDownloaderClass;//NicoDownloaderクラスの初期化
    const Nicovideo = new NicovideoClass;//NicovideoClassクラスの初期化

    // Downloadingがtrueの場合は終了
    if (NicoDownloader.VideoDownloadingCheck()) return false;

    // ダウンロードリンクをクリック
    NicoDownloader.DownloadLinkClick();

    // 現在のページのsm番号の取得しセット
    Nicovideo.video_sm = Nicovideo.VideoSmGet(NicoDownloader.MatchingSMIDArray);

    await Nicovideo.SetAllFromVideoSm(Nicovideo.video_sm);

    new Promise((resolve, reject) => {
        // sm番号かタイトルが取得できなかったら終了
        if (Nicovideo.video_sm == '' || Nicovideo.video_title == '') reject("video_sm or video_title is null");


        // デフォルト動画ファイル名の定義
        Nicovideo.video_name = NicoDownloader.VideoDownloadNameMake(Nicovideo.video_sm, Nicovideo.video_title);

        // すでに作ったリンクがあるかどうか判別し、あれば削除
        NicoDownloader.VideoTitleElementCheck(Nicovideo.video_sm);

        // resolve
        resolve();
    }).catch((err) => {
        DebugPrint("NDLGetData", err);
        return false;
    });


    //ダウンロードリンクの表示
    if (!NicoDownloader.VideoLoadedCheck(Nicovideo.video_sm)) {//ここがtrueになるとすでに読み込み済み


        new Promise((resolve, reject) => {

            //ボタンをとりあえず作成
            NicoDownloader.ButtonFirstMake();

            NicoDownloader.ButtonTextWrite('処理開始');//ボタンの文字を変更

            // 保存ボタンを作成
            NicoDownloader.SaveButtonMake(Nicovideo.video_name);

            //ダウンロード前のチェック処理
            if (NicoDownloader.CheckBeforeDownload() == false) reject("CheckBeforeDownload ERROR");

            if (NicoDownloader.VideoDownloadingCheck()) reject("Now Downloading");//ダウンロード中は終了

            // resolve
            resolve();
        }).then(() => {

            ////////////////////////////////////////////////////////////////
            // ここから実行部分
            ////////////////////////////////////////////////////////////////

            // systemMessageContainerからmasterURLを取得
            const masterURL = NicoDownloader.MasterURLGet();
            if (masterURL == false) return false;    // masterURLが取得できなかった場合は終了

            DebugPrint("masterURL:" + masterURL);

            if (NicoDownloader.VideoDownloadingCheck()) return false;//ダウンロード中は終了


            //delivery.domand.nicovideo.jpの処理はこちら！
            if (masterURL.indexOf('delivery.domand.nicovideo.jp') != -1) {
                // ダウンロード処理
                MovieDownload_domand(Nicovideo.video_sm, Nicovideo.video_name, NicoDownloader).then(() => {
                    NicoDownloader.VideoDownloadingReset();// ダウンロード中をリセット
                });

                NicoDownloader.VideoLoadedSMIDSet(Nicovideo.video_sm);// ダウンロードしたsm番号を記録

            }

        }).catch((value) => {
            DebugPrint("NDLDL");
            DebugPrint(value);
            return false;
        });

    }
    return true;
};

function SystemMessgeAutoOpen_Text() {
    let text = ""
    text += "new Promise(function(resolve) {document.querySelector(&#39;" + VideoData.PlayerSettingQuery + "&#39;).click();resolve();})";
    text += ".then(function() {document.querySelector(&#39;" + VideoData.SystemMessageQuery + "&#39;).click();});";
    return text;
}


let interval1st = false;
let intervalId;
try {

    clearInterval(intervalId)
    intervalId = setInterval(() => {

        if (interval1st) {
            try {

                VideoDown();
            } catch (e) {
                console.log(e);
            }
        } else {
            interval1st = true;
        }

    }, 2000);
} catch (error) {
    console.log(e);
}


//ページ表示時発火処理
window.onload = function () {
    Option_setLoading("video_downloading"); // デフォルト保存名の読み込み
}


function documentWriteText(URItext) {
    document.getElementById(VideoData.Video_DLlink.a).innerHTML = VideoData.DLButton.a + VideoData.DLButton.b + URItext + VideoData.DLButton.c;
}


function documentWriteOnclick(onclick) {
    document.getElementById(VideoData.Video_DLlink.a).onclick = onclick;
}
function DLstartOnclick(TSURLs, TSFilenames, m3u8s, video_sm, video_name) {
    documentWriteText("処理中……");

    //video_nameから末尾にある拡張子のみ抽出し、formatに代入する
    const format = video_name.match(/\.[a-zA-Z0-9]+$/).toString().replace('.', '');
    DownEncoder(TSURLs, TSFilenames, m3u8s, video_sm, video_name, format);

}


/**
 * 
 * @param {String} video_sm 
 * @param {String} video_name 
 * @param {NicoDownloaderClass} NicoDownloader 
 */

async function MovieDownload_domand(video_sm, video_name, NicoDownloader) {

    //Firstm3u8URLを取得
    const Firstm3u8URL = NicoDownloader.MasterURLGet();
    NicoDownloader.SetM3u8("FirstURL", Firstm3u8URL);
    NicoDownloader.SetM3u8("FirstBody", await NicoDownloader.DownloadTextWithCookie(NicoDownloader.M3u8.FirstURL));
    NicoDownloader.SetM3u8("FirstBody_json", NicoDownloader.Parsem3u8(NicoDownloader.M3u8.FirstBody));


    const Firstm3u8_body_json = NicoDownloader.Parsem3u8(NicoDownloader.M3u8.FirstBody);



    console.log(NicoDownloader.M3u8.FirstBody_json)
    const audio_m3u8_URL = NicoDownloader.M3u8.FirstBody_json["EXT-X-MEDIA"][0]['URI'];
    const video_m3u8_URL = NicoDownloader.M3u8.FirstBody_json["EXT-X-STREAM-INF"][0]['URI'];

    const audio_m3u8_body = await NicoDownloader.DownloadTextWithCookie(audio_m3u8_URL);
    const video_m3u8_body = await NicoDownloader.DownloadTextWithCookie(video_m3u8_URL);
    const audio_m3u8_body_json = NicoDownloader.Parsem3u8(audio_m3u8_body);
    const video_m3u8_body_json = NicoDownloader.Parsem3u8(video_m3u8_body);

    DebugPrint('audio:' + audio_m3u8_URL);
    DebugPrint('video:' + video_m3u8_URL);

    let replace_audio = replaceURL(audio_m3u8_body)
    let replace_video = replaceURL(video_m3u8_body)
    let replace_Firstm3u8 = replaceURL(NicoDownloader.M3u8.FirstBody)

    let m3u8s = [replace_audio, replace_video, replace_Firstm3u8,
        makeFilename(audio_m3u8_URL), makeFilename(video_m3u8_URL), makeFilename(Firstm3u8URL)];
    let TSURLs = makeTSURLs(video_m3u8_body_json, audio_m3u8_body_json);


    let TSFilenames = makeTSFilenames(TSURLs);


    documentWriteText(video_name + "をダウンロード");
    documentWriteOnclick(DLstartOnclick(TSURLs, TSFilenames, m3u8s, video_sm, video_name));
}

