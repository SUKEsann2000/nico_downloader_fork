//ここは使わなくなった古い関数の置き場
/*
function masterm3u8_addURL(url, urldir) {

    return String(urldir.match(/(https.).*(master.m3u8?.)/g)).replace('master.m3u8?', '') + url;
}
function playlistm3u8_addURL(url, urldir) {

    return String(urldir.match(/(https.).*(playlist.m3u8?.)/g)).replace('playlist.m3u8?', '') + url;
}
function MovieDownload_dmcnico(masterURL, video_sm, video_name) {

    //ダウンロード中フラグ立てる
    downloading = true;

    const xhr_master = new XMLHttpRequest();//XMLHttpRequest
    let masterRawMessage, playlistURL

    xhr_master.open('GET', masterURL);      //GETを作る
    xhr_master.send();                      //リクエストを投げる
    xhr_master.onreadystatechange = function () {
        if (xhr_master.readyState === 4 && xhr_master.status === 200) {

            if (video_link_smid == video_sm) {
                return false;
            }
            //ここで一回止める
            //読み込み形跡を残す
            video_link_smid = video_sm;
            DebugPrint("smid上書き");

            //取得完了したらここに飛ぶ
            masterRawMessage = this.responseText;

            //文字列を行ごとに分解する
            let masterURLGyou = masterRawMessage.split(/\r\n|\n/);
            //3行目は常に高画質っぽいのでそれだけ抽出
            playlistURL = String(masterURL.match(/(https.).*(master.m3u8?.)/g)).replace('master.m3u8?', '') + masterURLGyou[2];
            DebugPrint("playlistURL: " + playlistURL);


            //playlistURLにはダウンロードすべきm3u8のURLが入ってるのでそれをダウンロード
            const xhr_playlist = new XMLHttpRequest();
            xhr_playlist.open('GET', playlistURL);
            xhr_playlist.send();
            xhr_playlist.onreadystatechange = function () {
                if (xhr_master.readyState === 4 && xhr_master.status === 200) {
                    //取得完了したらここに飛ぶ
                    let playlistRawMessage = this.responseText;



                    //https://stabucky.com/wp/archives/10419
                    playlistRawMessage = playlistRawMessage.trim();
                    playlistRawMessage = playlistRawMessage.replace(/(\r?\n)+/g, "\n");

                    const playlistMessage = playlistRawMessage.split(/\r\n|\n/);
                    DebugPrint(playlistMessage);


                    //神 of GOD
                    //https://github.com/naari3/nico-downloader-ffmpeg/blob/main/src/background.ts
                    //ご協力感謝します

                    // playlistのアイテムを全部読み込む

                    //読み込んだTSファイルの置き場所配列
                    let TSURLs = [];
                    let fps = 60;

                    for (let i = 0; i < playlistMessage.length; i++) {
                        let element = playlistMessage[i];
                        if (element.match(/#/)) {
                            //#が入ってる行は飛ばす

                            if (element.match(/FRAME-RATE=([\d.]+)/)) {
                                fps = element.match(/FRAME-RATE=([\d.]+)/);
                            }

                        } else if (element == "") {
                            //空行は飛ばす
                        } else {
                            //TSURLの取得
                            const TSURL = String(playlistURL.match(/(https.).*(playlist.m3u8?.)/g)).replace('playlist.m3u8?', '') + element;
                            TSURLs.push(TSURL);
                        }

                        if (element.match(/ENDLIST/)) {
                            //ENDLISTが入ってる行まで読み込めばOK
                            DebugPrint("TSURLs.length:" + TSURLs.length);
                            if (TSURLs.length == 0) {
                                return;
                            }

                            documentWriteText(video_name + "をダウンロード");
                            documentWriteOnclick(DLstartOnclick(TSURLs, video_sm, video_name, String(fps)));

                        }
                    }

                    //フラグ戻す
                    downloading = false;

                    //読み込み形跡を残す
                    video_link_smid = video_sm;
                    DebugPrint("smid上書き");

                }
            }


        }
    }
}


function MovieDownload_dmcnico(masterURL, video_sm, video_name) {

    //ダウンロード中フラグ立てる
    downloading = true;

    const xhr_master = new XMLHttpRequest();//XMLHttpRequest
    let masterRawMessage, playlistURL

    xhr_master.open('GET', masterURL);      //GETを作る
    xhr_master.send();                      //リクエストを投げる
    xhr_master.onreadystatechange = function () {
        if (xhr_master.readyState === 4 && xhr_master.status === 200) {

            if (video_link_smid == video_sm) {
                return false;
            }
            //ここで一回止める
            //読み込み形跡を残す
            video_link_smid = video_sm;
            DebugPrint("smid上書き");

            //取得完了したらここに飛ぶ
            masterRawMessage = this.responseText;

            //文字列を行ごとに分解する
            let masterURLGyou = masterRawMessage.split(/\r\n|\n/);
            //3行目は常に高画質っぽいのでそれだけ抽出
            playlistURL = String(masterURL.match(/(https.).*(master.m3u8?.)/g)).replace('master.m3u8?', '') + masterURLGyou[2];
            DebugPrint("playlistURL: " + playlistURL);


            //playlistURLにはダウンロードすべきm3u8のURLが入ってるのでそれをダウンロード
            const xhr_playlist = new XMLHttpRequest();
            xhr_playlist.open('GET', playlistURL);
            xhr_playlist.send();
            xhr_playlist.onreadystatechange = function () {
                if (xhr_master.readyState === 4 && xhr_master.status === 200) {
                    //取得完了したらここに飛ぶ
                    let playlistRawMessage = this.responseText;



                    //https://stabucky.com/wp/archives/10419
                    playlistRawMessage = playlistRawMessage.trim();
                    playlistRawMessage = playlistRawMessage.replace(/(\r?\n)+/g, "\n");

                    const playlistMessage = playlistRawMessage.split(/\r\n|\n/);
                    DebugPrint(playlistMessage);


                    //神 of GOD
                    //https://github.com/naari3/nico-downloader-ffmpeg/blob/main/src/background.ts
                    //ご協力感謝します

                    // playlistのアイテムを全部読み込む

                    //読み込んだTSファイルの置き場所配列
                    let TSURLs = [];
                    let fps = 60;

                    for (let i = 0; i < playlistMessage.length; i++) {
                        let element = playlistMessage[i];
                        if (element.match(/#/)) {
                            //#が入ってる行は飛ばす

                            if (element.match(/FRAME-RATE=([\d.]+)/)) {
                                fps = element.match(/FRAME-RATE=([\d.]+)/);
                            }

                        } else if (element == "") {
                            //空行は飛ばす
                        } else {
                            //TSURLの取得
                            const TSURL = String(playlistURL.match(/(https.).*(playlist.m3u8?.)/g)).replace('playlist.m3u8?', '') + element;
                            TSURLs.push(TSURL);
                        }

                        if (element.match(/ENDLIST/)) {
                            //ENDLISTが入ってる行まで読み込めばOK
                            DebugPrint("TSURLs.length:" + TSURLs.length);
                            if (TSURLs.length == 0) {
                                return;
                            }

                            documentWriteText(video_name + "をダウンロード");
                            documentWriteOnclick(DLstartOnclick(TSURLs, video_sm, video_name, String(fps)));

                        }
                    }

                    //フラグ戻す
                    downloading = false;

                    //読み込み形跡を残す
                    video_link_smid = video_sm;
                    DebugPrint("smid上書き");

                }
            }


        }
    }
}

async function MovieDownload_dmcnico(masterURL, video_sm, video_name) {

    //ダウンロード中フラグ立てる
    downloading = true;

    const Firstm3u8_body = await TextDownload_withCookie(masterURL);
    DebugPrint(Firstm3u8_body);
    const Firstm3u8_body_json = m3u8_Parse(Firstm3u8_body);


    const video_m3u8_URL = masterm3u8_addURL(Firstm3u8_body_json["EXT-X-STREAM-INF"][0]['URI'], masterURL);
    const video_m3u8_body = await TextDownload_withCookie(video_m3u8_URL);
    const video_m3u8_body_json = m3u8_Parse(video_m3u8_body);


    let TSURLs = makeTSURLs_dmcnicovideo(video_m3u8_body_json);
    for (let i = 0; i < TSURLs.length; i++) {
        TSURLs[i] = playlistm3u8_addURL(TSURLs[i], video_m3u8_URL);
    }


    let TSFilenames = makeTSFilenames(TSURLs)

    let replace_video = video_m3u8_body.replace(/[?][\w=\-&_.~]+/g, '').replace('1/ts/', '');
    let replace_Firstm3u8 = Firstm3u8_body.replace(/[?][\w=\-&_.~]+/g, '').replace('1/ts/', '');;
    let m3u8s = [replace_video, replace_Firstm3u8,
        makeFilename(video_m3u8_URL).replace('1/ts/', ''), makeFilename(masterURL)];



    DebugPrint(String(TSURLs))
    documentWriteText(video_name + "をダウンロード");
    documentWriteOnclick(DLstartOnclick(TSURLs, TSFilenames, m3u8s, video_sm, video_name));



}

function makeTSURLs_dmcnicovideo(video_m3u8_body_json) {
    let TSURLs = [];
    for (let i = 0; i < video_m3u8_body_json['EXTINF'].length; i++) {
        TSURLs.push(video_m3u8_body_json['EXTINF'][i]['URI']);
    }
    return TSURLs;
}
*/