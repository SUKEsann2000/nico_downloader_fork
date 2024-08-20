//残したい変数
let video_link_smid = "-1"; //-1はロードしてない
let downloading = false;        //0はDLしてない、1はダウンロード最中


//ダウンロード関数

async function VideoDown() {

    //必要なクラスの初期化
    const NicoDownloader = new NicoDownloaderClass;//NicoDownloaderクラスの初期化
    const Nicovideo = new NicovideoClass;//NicovideoClassクラスの初期化
    NicoDownloader.VideoLoadedSet(video_link_smid);//すでに読み込んだかどうかの判定

    await new Promise((resolve, reject) => {//たぶんSetAllFromVideoSmとかに置き換える
        //sm番号の取得
        Nicovideo.video_sm = video_sm_Get(NicoDownloader.MatchingSMIDArray);//これはそのうちnicojson.jsの関数に置き換える
        //タイトルの取得
        Nicovideo.video_title = document.getElementsByClassName(VideoData.Video_title)[0].innerText;//これはそのうちnicojson.jsの関数に置き換える


        // resolve
        resolve();
    }).then(() => {

        //sm番号かタイトルが取得できなかったら終了
        if (Nicovideo.video_sm == '' || Nicovideo.video_title == '') return false;


        //デフォルト動画ファイル名の定義
        Nicovideo.video_name = NicoDownloader.VideoDownloadNameMake(Nicovideo.video_sm, Nicovideo.video_title);

        //すでに作ったリンクがあるかどうか判別し、あれば削除
        NicoDownloader.VideoTitleElementCheck(Nicovideo.video_sm);
    });


    //ダウンロードリンクの表示
    if (!NicoDownloader.VideoLoadedCheck(Nicovideo.video_sm)) {//ここがtrueになるとすでに読み込み済み

        //リンクをとりあえず作成
        NicoDownloader.VideoTitleElementFirstMake();

        NicoDownloader.ButtonTextWrite('処理開始');//ボタンの文字を変更
        DebugPrint("DL start");

        //videoが読み込めてなかったら出る
        if (!NicoDownloader.CheckMainVideoPlayer()) {
            NicoDownloader.ButtonTextWrite('MainVideoPlayerが読み込めません');//ボタンの文字を変更
            return false;
        }


        //ボタンを押したらシステムメッセージを強制的に読み込む
        if (document.getElementById(VideoData.Video_DLlink.li)) {
            //特にここには意味はない
        }
        //一時的に変える
        //VideoTitleElement_ERRORcheck(Nicovideo.video_name);

        // 保存ボタンを作成
        NicoDownloader.SaveButtonMake(Nicovideo.video_name);


        //システムメッセージを読み込めてなかったら出る
        if (NicoDownloader.CheckSystemMessageContainer() == false) return false;

        //初期設定してなかったら止める
        if (!NicoDownloader.NicoDownloaderFirstSettingCheck()) {
            return false;
        }


        ////////////////////////////////////////////////////////////////
        // ここから実行部分
        ////////////////////////////////////////////////////////////////



        //DebugPrint("masterURL:" + masterURL);

        // systemMessageContainerからmasterURLを取得
        const masterURL = SystemMessageContainer_masterURLGet();
        if (masterURL == null) return false;    // masterURLが取得できなかった場合は終了

        DebugPrint("masterURL:" + masterURL);

        if (downloading) return false;//ダウンロード中は終了


        //delivery.domand.nicovideo.jpの処理はこちら！
        if (masterURL.indexOf('delivery.domand.nicovideo.jp') != -1) {
            VideoTitleElement_Write(Nicovideo.video_name + "を保存") // ボタンを変更
            onclickDL(Nicovideo.video_sm, Nicovideo.video_name);                // ダウンロード開始
            video_link_smid = Nicovideo.video_sm;                    // ダウンロードしたsm番号を記録
        }
    }
    return true;
};

//domand 
async function onclickDL(video_sm, video_name) {


    if (downloading) return false;
    downloading = true;
    let domand_m3u8;
    try {
        throw new Error('domand api error')

    } catch (e) {

        try {

            if (SystemMessageContainer_masterURLGet() != false) {
                domand_m3u8 = SystemMessageContainer_masterURLGet();
            } else {
                throw new Error('システムメッセージからの取得失敗');
            }
        } catch (e) {
            VideoTitleElement_Write('保存失敗:1st m3u8 get error')
            return false;
        }
    }

    const return_domand = MovieDownload_domand(domand_m3u8, video_sm, video_name);
    if (return_domand == -1) {
        VideoTitleElement_Write('保存失敗:コンソールを参照してください')
        return false;
    }
    downloading = false;


    return true;
}

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
                downloadlink_click(); //ダウンロードリンクをクリック
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
    Option_setLoading("video_downloading");
}


function documentWriteText(URItext) {
    document.getElementById(VideoData.Video_DLlink.a).innerHTML = VideoData.DLButton.a + VideoData.DLButton.b + URItext + VideoData.DLButton.c;
}

function documentWriteHTML(text) {
    document.getElementById(VideoData.Video_DLlink.a).innerHTML = text;
}

function documentWriteDLHTML(text) {
    document.getElementById(VideoData.Video_DLlink.a).innerHTML = VideoData.DLButton.a + " onclick=\'\'" + VideoData.DLButton.b + text + VideoData.DLButton.c;
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

//将来的にここはnicojson.jsのNicovideoClass.video_smを使う
function video_sm_Get(match_sm) {
    let video_sm = '';
    if (location.href.match(match_sm)) {
        video_sm = location.href.match(match_sm).toString();
        DebugPrint("location.href.match match_sm true")
        DebugPrint("match_sm : " + match_sm)
    } else {
        DebugPrint("location.href.match match_sm false")
        DebugPrint("match_sm : " + match_sm)
        DebugPrint("setOption(\"video_pattern\") : " + setOption("video_pattern"))
    }
    return video_sm;
}

function downloadlink_click() {
    if (document.getElementById(VideoData.Video_DLlink.a2) != null) {
        //ダウンロードのタグがあればクリック
        const link = document.getElementById(VideoData.Video_DLlink.a2);
        link.click();
        link.remove();
        documentWriteText("保存完了");

    }
}

function VideoTitleElement_Check(video_sm) {
    //この関数はすでに作ったリンクがあるかどうかを判別する
    if (video_link_smid !== video_sm && video_link_smid !== "-1") {
        DebugPrint("video_link_smidリセット")
        DebugPrint("video_link_smid : " + video_link_smid)
        DebugPrint("video_sm : " + video_sm)
        //video_link_smidが現在のものと同じじゃないならすでに読み込んだ形跡があるので一回消す
        video_link_smid = "-1";
        document.getElementById(VideoData.Video_DLlink.p).remove();

    }
}


function VideoTitleElement_ERROR(video_name, hlssavemode = '1') {

    let add_error = "";
    add_error += VideoData.DLButton.a + " onclick=\'" + SystemMessgeAutoOpen_Text() + "\' " + VideoData.DLButton.b + video_name + "を保存" + VideoData.DLButton.c;


    if (hlssavemode == "0") {
        const optionURL = chrome.runtime.getURL('options.html');
        add_error = VideoData.DLButton.a + " onclick=\'location.href=&quot;" + optionURL + "&quot;\' " + VideoData.DLButton.b + "◆nico downloaderの初期設定を行って下さい◆<a href=\"" + optionURL + "\"><br>設定画面を開く</a>" + VideoData.DLButton.c;
    } else if (hlssavemode == "1") {
        add_error += "</p>"
    } else if (hlssavemode == "2") {
        add_error += "[高速モード]</p>";
    }
    add_error += "</button>";
    return add_error;

}
function VideoTitleElement_ERRORcheck(video_name) {
    //hlsになっている場合
    DebugPrint("hls mode");
    const hlssavemode = setOption("video_hlssave");

    //エラー文を用意する
    const add_error = VideoTitleElement_ERROR(video_name, hlssavemode);
    VideoTitleElement_Write(add_error);

}
function VideoTitleElement_Write(txt) {//NicoDownloaderClass.ButtonTextWriteに置き換える

    document.getElementById(VideoData.Video_DLlink.a).innerHTML = txt;

}
function SystemMessageContainer_masterURLGet() {
    //メッセージより読み込み
    let rawMessage;
    let tempURL = '';
    for (let i = 0; i < document.getElementsByClassName(VideoData.SystemMessageContainer).length; i++) {
        DebugPrint("masterURL" + i)
        const message = document.getElementsByClassName(VideoData.SystemMessageContainer)[i].innerText;
        if (message.match(/(動画の初期化処理が完了しました).*/)) {
            DebugPrint("URL発見");
            rawMessage = String(message)
            tempURL = String(rawMessage.replace('動画の初期化処理が完了しました (', '').replace(')', ''));
            DebugPrint("masterURL:" + tempURL);
        }
    };
    if (tempURL == null) return false;
    if (tempURL == '') return false;
    const masterURL = tempURL;
    if (masterURL == null) return false;

    return masterURL;
}
async function MovieDownload_domand(Firstm3u8URL, video_sm, video_name) {
    //ダウンロード中をセット
    downloading = true;
    const Firstm3u8_body = await TextDownload_withCookie(Firstm3u8URL);
    DebugPrint(Firstm3u8_body);

    const Firstm3u8_body_json = m3u8_Parse(Firstm3u8_body);

    console.log(Firstm3u8_body_json)
    const audio_m3u8_URL = Firstm3u8_body_json["EXT-X-MEDIA"][0]['URI'];
    const video_m3u8_URL = Firstm3u8_body_json["EXT-X-STREAM-INF"][0]['URI'];

    const audio_m3u8_body = await TextDownload_withCookie(audio_m3u8_URL);
    const video_m3u8_body = await TextDownload_withCookie(video_m3u8_URL);
    const audio_m3u8_body_json = m3u8_Parse(audio_m3u8_body);
    const video_m3u8_body_json = m3u8_Parse(video_m3u8_body);

    DebugPrint('audio:' + audio_m3u8_URL);
    DebugPrint('video:' + video_m3u8_URL);

    let replace_audio = replaceURL(audio_m3u8_body)
    let replace_video = replaceURL(video_m3u8_body)
    let replace_Firstm3u8 = replaceURL(Firstm3u8_body)

    let m3u8s = [replace_audio, replace_video, replace_Firstm3u8,
        makeFilename(audio_m3u8_URL), makeFilename(video_m3u8_URL), makeFilename(Firstm3u8URL)];
    let TSURLs = makeTSURLs(video_m3u8_body_json, audio_m3u8_body_json);


    let TSFilenames = makeTSFilenames(TSURLs);


    documentWriteText(video_name + "をダウンロード");
    documentWriteOnclick(DLstartOnclick(TSURLs, TSFilenames, m3u8s, video_sm, video_name));
}
function genActionTrackID() {
    //ニコニコにあったやつwatch.XXXXXXXXXXX.min.js
    for (var e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJLKMNOPQRSTUVWXYZ0123456789".split(""), t = "", n = 0; n < 10; n++)
        t += e[Math.floor(Math.random() * e.length)];
    return t + "_" + Date.now()
}

function m3u8_Parse(dataText) {
    //""の間に,が来るとそこで止まるが仕方ないということにしておきます
    //どうせそれでてくるやつ使わないので


    DebugPrint(dataText);
    //行毎に分ける
    const Datas = dataText.split(/\n/);

    //json
    let jsondata = {};

    //m3u8じゃなかったらパースができないので出る
    if (Datas[0] != '#EXTM3U') {
        return null;//ERROR
    }

    for (let i = 1; i < Datas.length; i++) {
        if (Datas[i].startsWith('#EXT-X-ENDLIST')) {
            //正常終了
            break;
        }
        if (Datas[i] == '' && i == Datas.length - 1) {
            //正常終了
            break;
        }
        if (Datas[i].indexOf(':') == -1) {
            continue;
        }
        if (Datas[i].startsWith('https') || Datas[i].indexOf('1/ts/') != -1 || Datas[i].indexOf('.ts?ht2_nicovideo') != -1) {
            //URL行はいったん無視する
        } else {
            let tempData = Datas[i];
            const Datakey_match = Datas[i].match(/#[A-Z-]+:/);

            const Datakey = Datakey_match[0].replace('#', '').replace(':', '');
            tempData = tempData.replace(Datakey_match, '')

            if (!jsondata[Datakey]) {
                //空配列作成
                jsondata[Datakey] = [];
            }



            if (tempData.indexOf(',') == -1 && tempData.indexOf('=') == -1) {
                jsondata[Datakey].push(tempData);
            } else {
                if (tempData.slice(0, 10).match(/[0-9].[0-9]{1,},/)) {
                    let temp = { sec: tempData.match(/[0-9].[0-9]{1,},/) };
                    jsondata[Datakey].push(temp);

                } else {
                    let tempjson = {};
                    DebugPrint(tempData);
                    let temp = tempData.match(/[\w]+=[\"]?[\w:/.\-\?\=~& ]+[\"]?/g);

                    for (let e = 0; e < temp.length; e++) {
                        const key_match = temp[e].match(/[\w-]+=/);
                        const key = key_match.toString().replace('=', '');
                        let value = temp[e].replace(key_match, '').replaceAll('"', '').replaceAll('\\', '');
                        tempjson[key] = value;
                    }

                    jsondata[Datakey].push(tempjson);

                }
            }
            if (Datas[i + 1].startsWith('https') || Datas[i + 1].indexOf('1/ts/') != -1 || Datas[i + 1].indexOf('.ts?ht2_nicovideo') != -1) {
                DebugPrint(Datas[i + 1]);
                const latest = jsondata[Datakey].length - 1;
                jsondata[Datakey][latest]['URI'] = Datas[i + 1];
            }

        }
    }

    return jsondata;


}
