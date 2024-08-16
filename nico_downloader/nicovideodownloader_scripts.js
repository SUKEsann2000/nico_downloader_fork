

//残したい変数
let video_link_smid = "-1"; //-1はロードしてない
let downloading = 0;        //0はDLしてない、1はダウンロード最中

const VideoData = {
    Video_title: 'fs_xl fw_bold',
    Video_title_Element: 'd_flex justify_space-between items_flex-start gap_x3 w_100%',
    //Video_title_Element: 'd_flex w_[268px] gap_base items_center',
    Video_DLlink: {
        p: 'Dlink',
        div_class: 'd_flex justify_flex-start',
        a: 'DLlink_a',
        li: 'DLlink_li',
        a2: 'downloadlink'
    },
    SystemMessageContainer: 'text_monotone.L80',
    PlayerSettingQuery: '[aria-label="設定"]',
    PlayerSettingClass: 'h_[calc(100vh_-_{sizes.commonHeader.inViewHeight}_-_{sizes.webHeader.height}_-_{spacing.x12})] max-h_[480px] rounded_m bg_layer.surfaceHighEm d_flex flex_column overflow_hidden shadow_base',
    SystemMessageClass: 'cursor_pointer d_inline-flex items_center justify_center gap_x0_5 px_x2 rounded_full fs_s fw_bold button-color_base white-space_nowrap select_none hover:cursor_pointer disabled:pointer-events_none [&_>_svg]:w_auto [&_>_svg]:h_x3 h_x3 [&_svg]:d_none',
    SystemMessageQuery: '[class^="cursor_pointer d_inline-flex items_center justify_center gap_x0_5 px_x2 rounded_full fs_s fw_bold button-color_base white-space_nowrap select_none hover:cursor_pointer disabled:pointer-events_none"]',
    DLButton: {
        a: "<button style='width:200px;height:56px;color: var(--colors-action-text-on-tertiary-azure);background-color: var(--colors-action-base);border-radius: var(--radii-m)'",
        b: '"\'><b>',
        c: '</b>'
    }

}

//ダウンロード関数

async function VideoDown() {

    //動画タイトルの定義
    const video_title = document.getElementsByClassName(VideoData.Video_title)[0].innerText;

    //動画sm番号の定義
    const match_sm = match_sm_Get();
    const video_sm = video_sm_Get(match_sm);
    if (video_sm == '') {
        return false;
    }

    //デフォルト動画ファイル名の定義
    const video_name = VideoNameMake(video_sm, video_title);

    //すでに作ったリンクがあるかどうか判別し、あれば削除
    VideoTitleElement_Check(video_sm);


    //ダウンロードリンクの表示
    if (video_link_smid === "-1") {

        //リンクをとりあえず作成
        VideoTitleElement_FirstMake();
        documentWriteText('処理開始');
        DebugPrint("DL start");

        //videoが読み込めてなかったら出る
        if (document.querySelector("video").getAttribute('src') == null) {
            VideoTitleElement_Write('MainVideoPlayerが読み込めません');
            return false;
        }


        //ボタンを押したらシステムメッセージを強制的に読み込む
        if (document.getElementById(VideoData.Video_DLlink.li)) {
            //押ささっていたときの処理
            console.log('押下')
            SystemMessageAutoOpen();

        }

        //一時的に変える
        VideoTitleElement_ERRORcheck(video_name);

        //システムメッセージを読み込めてなかったら出る
        if (document.getElementsByClassName(VideoData.SystemMessageContainer).length == 0) {
            return false;
        }

        //初期設定してなかったら止める
        if (document.getElementById(VideoData.Video_DLlink.a).innerHTML.indexOf('◆◆◆◆nico downloaderの初期設定を行ってください◆◆◆◆') != -1) {
            return false;
        }


        ////////////////////////////////////////////////////////////////
        // ここから実行部分
        ////////////////////////////////////////////////////////////////



        //DebugPrint("masterURL:" + masterURL);
        const masterURL = SystemMessageContainer_masterURLGet();
        if (masterURL == null) return false;

        DebugPrint("masterURL:" + masterURL);
        if (downloading) return false;


        //delivery.domand.nicovideo.jpの処理はこちら！
        if (masterURL.indexOf('delivery.domand.nicovideo.jp') != -1) {
            VideoTitleElement_Write(video_name + "を保存")
            onclickDL(video_sm, video_name);
            video_link_smid = video_sm;
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
//この関数は使っていないがこの挙動がほしい
async function SystemMessageAutoOpen() {

    new Promise((resolve) => {
        //プレーヤー設定を自動的に押す
        document.querySelector(VideoData.PlayerSettingQuery).click();
        resolve();
    }).then(function () {
        //システムメッセージを開く
        document.querySelector(VideoData.SystemMessageQuery).click();
    })
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

function VideoNameMake(video_sm, video_title, kakuchoushi = ".mp4") {
    let video_name = "";
    const video_name_value = setOption("video_downloading");

    //video_name
    if (video_name_value !== "1" &&
        video_name_value !== "2" &&
        video_name_value !== "3") {

        video_name = video_name + video_sm;
    } else if (video_name_value === "1") {
        video_name = video_name + video_title;
    } else if (video_name_value === "2") {
        video_name = video_name + video_sm;
        video_name = video_name + "_";
        video_name = video_name + video_title;
    } else if (video_name_value === "3") {
        video_name = video_name + video_title;
        video_name = video_name + "_";
        video_name = video_name + video_sm;
    }
    video_name = video_name + kakuchoushi;
    return video_name;
}


function match_sm_Get() {
    let match_sm = '0';
    try {
        DebugPrint("match_sm初期値 : " + match_sm)
        match_sm = setOption("video_pattern");
        DebugPrint("match_sm読込 : " + match_sm)
        if (match_sm == "0") {
            match_sm = "sm[0-9]{1,}";
        }
        DebugPrint("match_smｴﾗｰ処理 : " + match_sm)
    } catch (error) {
        match_sm = "sm[0-9]{1,}";
        DebugPrint("ndl:er " + error)
    }
    return match_sm;
}
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

//リンクの作成をする
function VideoTitleElement_FirstMake() {
    DebugPrint("DL link make");

    let p_link = document.createElement("p");
    p_link.id = VideoData.Video_DLlink.p;
    p_link.className = VideoData.Video_DLlink.div_class;
    let a_link = document.createElement("a");
    a_link.innerText = "処理中";
    a_link.id = VideoData.Video_DLlink.a;

    if (!document.getElementById(p_link.id)) {
        document.getElementsByClassName(VideoData.Video_title_Element)[0].appendChild(p_link);
        document.getElementsByClassName(VideoData.Video_title_Element)[0].querySelector("p").appendChild(a_link);
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
function VideoTitleElement_Write(txt) {

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
