// 截取可见区域
const btn = document.getElementById("screensort");
btn.onclick = function () {
    chrome.tabs.captureVisibleTab(null, {}, function (dataUrl) {
        console.log(dataUrl);
        downloadFile(dataUrl, 'screensortFileName');
    });
}

// 截取局部区域
const pathBtn = document.getElementById("pathScreensort");
pathBtn.onclick = function (e) {
    chrome.tabs.query({
            'active': true,
            'windowId': chrome.windows.WINDOW_ID_CURRENT
        },
        function (tabs) {
            extension.clickAndGetPathFrame({
                sourceType: 'from_popup'
            }, tabs[0]);
        }
    );
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message && message.type && message.type === 'screen') {
        downloadFile(message.dataUrl, 'screensortFileName');
        sendResponse('截图完成')
    }

});



// 下载文件
function downloadFile(content, fileName) {
    let aLink = document.createElement('a');
    let blob = base64ToBlob(content);
    //new Blob([content]);    
    let evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", true, true);
    //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为   
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
}

//下载base64图片    
var base64ToBlob = function (code) {
    let parts = code.split(';base64,');
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;
    let uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {
        type: contentType
    });
};
var extension = chrome.extension.getBackgroundPage();
// 获取全部图片
const getImageBtn = document.getElementById("getAllImage");
getImageBtn.onclick = function () {
    chrome.tabs.query({
            'active': true,
            'windowId': chrome.windows.WINDOW_ID_CURRENT
        },
        function (tabs) {
            extension.clickAndGetAllImage({
                sourceType: 'from_popup'
            }, tabs[0]);
        }
    );
}