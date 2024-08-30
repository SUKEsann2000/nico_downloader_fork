//https://github.com/ffmpegwasm/ffmpeg.wasm-core/blob/1f3461d4162ea41dd714c5cae7fff08fda362ad8/wasm/examples/browser/js/utils.js
//をもとに改造したもの
//LGPL

let last_save_sm = "";
let last_save_sm_URI = "";

const parseArgs = (Core, args) => {
  const argsPtr = Core._malloc(args.length * Uint32Array.BYTES_PER_ELEMENT);
  args.forEach((s, idx) => {
    const buf = Core._malloc(s.length + 1);
    Core.writeAsciiToMemory(s, buf);
    Core.setValue(argsPtr + (Uint32Array.BYTES_PER_ELEMENT * idx), buf, 'i32');
  });
  return [args.length, argsPtr];
};

const ffmpeg = (Core, args) => {
  Core.ccall(
    "main",
    'number',
    ['number', 'number'],
    parseArgs(Core, ['ffmpeg', '-nostdin', ...args]),
  );//https://github.com/naari3/nico-downloader-ffmpeg/blob/main/src/background.ts
};

const runFFmpeg = async (Core, video_sm, ofilename) => {
  let resolve = null;
  const waitEnd = new Promise((r) => {
    resolve = r;
  });
  try {
    documentWriteText("ファイルの結合中");
    ffmpeg(Core, ['-f', 'concat', '-i', video_sm + ".txt", "-c", "copy", ofilename]);
    //ffmpeg(Core, ['-f', 'concat', '-r', fps, '-i', video_sm + ".txt", '-r', fps, ofilename]);//可変FPSなのでfps入れるとおかしくなる


    //m3u8入れるとこれ？
    //ffmpeg(Core, ['-i', video_sm + ".m3u8", "-c", "copy", ofilename]);

    //ここをcopyでやらないと変換速度がx0.1とかになる
  } catch (err) {
    DebugPrint("FFmpeg:" + err);
  };
  await waitEnd;
  DebugPrint("waitEnd");

};

const runFFmpeg_m3u8 = async (Core, m3u8name, ofilename) => {
  let resolve = null;
  const waitEnd = new Promise((r) => {
    resolve = r;
  });
  try {

    //m3u8入れるとこれ？
    ffmpeg(Core, ['-allowed_extensions', 'ALL', '-i', m3u8name, "-c", "copy", ofilename]);

    //ここをcopyでやらないと変換速度がx0.1とかになる
  } catch (err) {
    DebugPrint("runFFmpeg:" + err);
  };
  await waitEnd;
  DebugPrint("waitEnd");

};

/**
 * ファイルタイプからMIMEタイプを返す
 * @param {String} filetype ファイルタイプ
 * @returns {String} MIMEタイプ
 * @see https://developer.mozilla.org/ja/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 * @see https://developer.mozilla.org/ja/docs/Web/HTTP/Basics_of_HTTP/MIME_types
 * @see https://developer.mozilla.org/ja/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
  */
function FiletypeToMimetype(filetype) {
  switch (filetype) {
    case "mp4":
      return "video/mp4";
    case "wav":
      return "audio/wav";
    case "mp3":
      return "audio/mpeg";
    case "webm":
      return "video/webm";
    default:
      return "video/mp4";
  }
}

//ここから追記
/**
 * ダウンロードし変換する関数
 * @param {NicoDownloaderClass} NicoDownloader 
 * @param {Array} m3u8s 
 * @param {NicovideoClass} Nicovideo
 * @returns 
 */
async function DownEncoder(NicoDownloader, m3u8s, Nicovideo) {

  NicoDownloader.SetVideoFormat(Nicovideo.video_name);//フォーマットをセット
  if (NicoDownloader.CheckVideoFormat() == false) return false;//フォーマットをチェック


  //ダウンロード前のチェック処理
  if (NicoDownloader.VideoDownloadingCheck()) {//ダウンロード中は終了
    return false;
  } else {
    NicoDownloader.VideoDownloadingSet();//ダウンロード中フラグを立てる
  }

  NicoDownloader.DownloadFaultNumReset();//ダウンロードエラー数をリセット

  NicoDownloader.DownloadPercentageReset();//パーセンテージをリセット




  //https://github.com/naari3/nico-downloader-ffmpeg/blob/main/src/background.ts  //偉大なる@_naari_氏による協力に感謝いたします
  let file = null;
  const core = await createFFmpegCore({
    printErr: (e) => DebugPrint(`FFMPEG:${e}`),
    print: (e) => {
      DebugPrint(`FFMPEG: ${e}`);
      if (e.startsWith("FFMPEG_END")) {
        DebugPrint("FFMPEG_END 変換終了");
        if (last_save_sm !== Nicovideo.video_sm) {
          last_save_sm = Nicovideo.video_sm;
          const ofilename = Nicovideo.video_sm + "." + NicoDownloader.CheckVideoFormat();
          file = core.FS.readFile(ofilename);
          console.log({ file });
          core.FS.unlink(ofilename);

          //blob
          const blob = new Blob(
            [file.buffer],
            {
              type: FiletypeToMimetype(NicoDownloader.CheckVideoFormat()),
            });


          //ダウンロード
          const a = document.createElement('a');
          a.id = VideoData.Video_DLlink.a2;
          document.body.appendChild(a);

          const link = document.getElementById(VideoData.Video_DLlink.a2);
          link.href = URL.createObjectURL(blob);
          link.download = Nicovideo.video_name;

          link.style.display = 'none';

          document.body.click();

          NicoDownloader.ButtonTextWrite("まもなく保存完了");



        } else {
          NicoDownloader.ButtonTextWrite("まもなく保存完了");
        }

      }
    },
  });
  console.debug({ core });

  //URLsを片っ端から処理
  //落としてファイルシステムにいれていく
  let promises = [];
  for (let i = 0; i < NicoDownloader.TSURLs.length; i++) {

    const promise = new Promise((resolve, reject) => {


      DownloadUint8Array(NicoDownloader.TSURLs[i], NicoDownloader)
        .then(byte => {
          let filenumber = i + 1;

          let filename = NicoDownloader.TSFilenames[i];
          core.FS.writeFile(filename, byte);
          DebugPrint("FSwrite:" + filename);

          const downpercentage = 100 * filenumber / NicoDownloader.TSURLs.length;
          if (downpercentage > NicoDownloader.DownloadPercentageGet()) {
            NicoDownloader.DownloadPercentageSet(downpercentage);
          }
          let text_dl = "ダウンロード中…… (" + NicoDownloader.DownloadPercentageGet().toFixed(1) + "%)";
          if (NicoDownloader.DownloadFaultNumCheck() != 0) {
            text_dl += "●";
          }

          NicoDownloader.ButtonTextWrite(text_dl);

          DebugPrint("180: " + core.FS.stat(filename));
          resolve(filename);
        });



    });

    promises.push(promise);

    if (i % 2 == 1) {
      await Promise.all(promises);
    }
  }




  //Transcodeする

  await Promise.all(
    promises
  ).then(() => {

    //間違ってURLを読みに行くのでm3u8を3つ書き換える
    //m3u8末尾の3個
    const m3u8s_num = m3u8s.length / 2;
    for (let i = 0; i < m3u8s_num; i++) {
      DebugPrint(m3u8s[m3u8s_num + i] + ' -> ' + new TextEncoder().encode(m3u8s[i]))
      core.FS.writeFile(m3u8s[m3u8s_num + i], new TextEncoder().encode(m3u8s[i]));
    }

    const m3u8name = m3u8s[m3u8s.length - 1];
    NicoDownloader.ButtonTextWrite('結合処理中');


    Transcode(core, Nicovideo.video_sm, m3u8name, NicoDownloader).then(() => {
      NicoDownloader.VideoDownloadingReset();// ダウンロード中をリセット
    });
  });

  return true;

}

/**
 * URLからダウンロードし、Blobを返す
 * @param {String} url ダウンロードするURL
 * @param {NicoDownloaderClass} NicoDownloader
 * @returns {Object} Blob
 */
async function Downloadblob(url, NicoDownloader) {

  //TSの取得
  let res = await fetch_retry(url, NicoDownloader, { credentials: 'include' }, 100);

  let blob = res.blob();
  DebugPrint("BLOBgetEnd:" + url);
  return blob;
};

/**
 * URLからダウンロードし、Uint8Arrayを返す
 * @param {String} url ダウンロードするURL
 * @param {NicoDownloaderClass} NicoDownloader
 * @returns {Object} Uint8Array
 */
async function DownloadUint8Array(url, NicoDownloader) {
  let blob = await Downloadblob(url, NicoDownloader);
  let byte = null;
  await blob.arrayBuffer().then(data => {
    byte = new Uint8Array(data);
  });
  return byte;
}

const Transcode = async function (Core, video_sm, m3u8name, NicoDownloader) {
  const outputvideo_name = video_sm + "." + NicoDownloader.CheckVideoFormat();

  NicoDownloader.ButtonTextWrite("変換中……");
  //const { file } = await runFFmpeg(Core, video_sm, outputvideo_name, fps);
  const { file } = await runFFmpeg_m3u8(Core, m3u8name, outputvideo_name);
  return file;
};

//https://qiita.com/ksakiyama134/items/8cfb0cf96d8f7c7be5b3
const fetch_retry = async (url, NicoDownloader, options, n) => {
  try {
    DebugPrint('fetchurl: ' + url);
    let fetched = await fetch(url, options);
    if (fetched.status === 200) {
      return fetched;
    } else {
      DebugPrint("retry:" + url);
      NicoDownloader.DownloadFaultNumberAdd();
      sleep(1000);
      return await fetch_retry(url, NicoDownloader, options, n - 1);
    }
  } catch (err) {
    NicoDownloader.DownloadFaultNumberAdd();
    sleep(1000);
    DebugPrint("retry:" + url);
    if (n === 1) throw err;
    return await fetch_retry(url, NicoDownloader, options, n - 1);
  }
};


//https://www.sejuku.net/blog/24629
function sleep(waitMsec) {
  var startMsec = new Date();

  // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
  while (new Date() - startMsec < waitMsec);
}


