//ffmpegだとこんな感じ
//ffmpeg -allowed_extensions ALL -protocol_whitelist file,http,https,tcp,tls,crypto -i video-h264-720p.m3u8  -c copy "output.ts"
//ローカルで変換するためにvideo-h264-XXXp.m3u8のファイルの中身を書き換える
//https://asset.domand.nicovideo.jp/XXXXXXXXXXXXXXXXXX/video/1/video-h264-720p/を削除
//https://delivery.domand.nicovideo.jp/hls/XXXXXXXXXXXXXXXXX/keys/を削除
//あとは全部ローカルに保存して結合すると映像のみができあがる



//https://www.nicovideo.jp/watch/sm37845720?responseType=json
//で取得できる



/*
        GetWatchthreadKey_and_Moviedata_toJSON(video_sm).then((jsondata) => {
            const threadKey = JSON_to_threadKey(jsondata);
            DebugPrint("threadKey:" + threadKey);
        })
*/

async function GetWatchthreadKey_and_Moviedata_toJSON(smid) {
    const URL = 'https://www.nicovideo.jp/watch/' + smid + '?responseType=json'
    // dataExist  data.media.domand.accessRightKey




    const dataJSON = await (
        await fetch(URL,
            {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "ja-JP,ja;q=0.9",
                    "sec-ch-ua": "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?1",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site"
                },
                "referrer": "https://www.nicovideo.jp/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            }
        )).json();

    return dataJSON;
}
function JSON_to_threadKey(JSON) {
    const threadKey = JSON.data.response.media.domand.accessRightKey;
    return threadKey;
}
async function GetHlsData(JSON) {
    const hlsData = JSON.data.response.media.delivery.hls;
    return hlsData;
}