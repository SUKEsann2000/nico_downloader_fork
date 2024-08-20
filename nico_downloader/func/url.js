// Description: ニコニコ動画の動画をダウンロードする関数を定義する


function makeTSFilenames(TSURLs) {

    let TSFilenames = [];
    //TSURLsのファイル名をすべて出す
    for (let i = 0; i < TSURLs.length; i++) {
        const fname = makeFilename(TSURLs[i]);
        TSFilenames.push(fname);
    }
    return TSFilenames;
}

//TSURLsのファイル名を作成
function makeTSURLs(audio_m3u8_body_json, video_m3u8_body_json) {
    let TSURLs = [];
    //URIキーをすべてTSURLsにいれる
    TSURLs.push(audio_m3u8_body_json['EXT-X-MAP'][0]['URI']);
    TSURLs.push(audio_m3u8_body_json['EXT-X-KEY'][0]['URI']);
    for (let i = 0; i < audio_m3u8_body_json['EXTINF'].length; i++) {
        TSURLs.push(audio_m3u8_body_json['EXTINF'][i]['URI']);
    }
    TSURLs.push(video_m3u8_body_json['EXT-X-MAP'][0]['URI']);
    TSURLs.push(video_m3u8_body_json['EXT-X-KEY'][0]['URI']);
    for (let i = 0; i < video_m3u8_body_json['EXTINF'].length; i++) {
        TSURLs.push(video_m3u8_body_json['EXTINF'][i]['URI']);
    }
    return TSURLs;
}

//ファイル名をURLから作成
function makeFilename(URL) {

    let ret = '';
    DebugPrint('URL:' + URL);
    if (URL.startsWith('https')) {
        ret = URL.match(/\/[\w-.]+\?/).toString().replace('/', '').replace('?', '');
    } else {
        ret = URL.match(/[\w-.]+\?/).toString().replace('/', '').replace('?', '');
    }
    DebugPrint('makeFilename: ' + ret + ' ' + URL);
    return ret;
}

//
function replaceURL(url) {
    let temp = url.replace(/https:\/\/[\w\.\/-]+[\/]{1}/g, '');
    temp = temp.replace(/[?][\w=\-&_~]+/g, '');

    return temp;
}

