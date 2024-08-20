/*
LocalStorageで保存される値について

キー                 デフォルト値               内容
"newloading"               undefined        一度でも設定したことがあるか？
"video_downloading"     0                   デフォルト保存名設定
"video_pattern"         sm[0-9]{1,}         反応するURL設定名
"video_autosave"        0                   1だと自動で保存処理が走ります
"video_hlssave"         0                   0だと初期設定、1だと低速、2だと高速モード
"debug"                 0                   1だとデバッグ出力あり
 */


function Option_setWriting(name, value) {
    //ローカルストレージに書き込みを行います
    localStorage.setItem(name, value);
    chrome.storage.local.set({
        [name]: value
    }, function () {
        //chrome.storage.localに保存
    })
    return true;
}

function Option_setLoading(name) {
    //ローカルストレージより読み込みを行います
    //return localStorage.getItem(name);//これだとだめ

    try {
        chrome.storage.local.get(name, function (value) {
            //chrome.storage.localから読み出し
            localStorage.setItem(name, value[name]);
        })
        //return return_val;
        return localStorage.getItem(name);

    } catch (error) {
        return 0;
    }

}

//オプション値読み込み用関数
function setOption(name) {
    try {
        if (Option_setLoading(name) === "undefined") {
            return 0;
        } else {

            return Option_setLoading(name);
        }

    } catch (error) {
        DebugPrint("SetOption:" + error)
        return 0;
    }
}

function newload() {
    let newloading = 0;


    //default値をここへ
    if (isNullOrUndefined(Option_setLoading("newloading"))) {
        defalt_dataWrite();
    }
    newloading = Option_setLoading("newloading")
}

function defalt_dataWrite() {
    Option_setWriting("newloading", "1");
    Option_setWriting("video_downloading", "0");
    Option_setWriting("video_pattern", "sm[0-9]{1,}");
    Option_setWriting("video_autosave", "0");
    Option_setWriting("debug", "0");
    Option_setWriting("video_hlssave", "0")
    Options_Save();
}

function Options_onload() {
    //オプション設定ページ表示時

    //オプションの値を読み込み
    try {
        LoadOption("video_downloading");
        LoadOption("video_pattern");
        LoadOption("video_autosave");
        LoadOption("video_hlssave");
        LoadOption("debug");
    } catch (error) {
        Default_click();
        Options_Save();
    }

}

function LoadOption(name) {
    console.log(setOption(name))
    if (typeof setOption(name) === "undefined") {

    } else {
        document.getElementById(name).value = setOption(name);
    }
}

function isNullOrUndefined(o) {
    return (o === undefined || o === null);
}


function DebugPrint(text) {
    if (setOption("debug") === "1") {
        console.log("debug:" + text);
    }
}