// 截取可见区域
const btn = document.getElementById("screensort");
btn.onclick = function () {
    chrome.tabs.captureVisibleTab(null, {}, function (dataUrl) {
        console.log(dataUrl);
        downloadFile(dataUrl, screensortFileName.value);
    });
}

// 截取局部区域
const pathBtn = document.getElementById("pathScreensort");
pathBtn.onclick = function (e) {
    chrome.runtime.sendMessage({
        info: '发送消息测试',
        type: 'pathScreensort'
    }, res => {
        console.log('接收的消息', res);
    })
}

// 在页面加载完成后注入JavaScript
// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//     if (changeInfo.status == 'complete') {
//         chrome.tabs.executeScript(tabId, {
//             code: `
//         // 在页面中创建按钮
//         const button = document.createElement('button');
//         button.innerHTML = '点击我修改页面内容';

//         console.log(document,'sssssssssss')
//         // 当按钮被点击时，修改页面内容
//         button.addEventListener('click', function() {
//           // 在这里添加修改页面内容的代码
//           alert('aaaa')
//         });
  
//         // 将按钮添加到页面中
//         document.body.appendChild(button);
//       `
//         });
//     }
// });



// 文件名称
let screensortFileName = document.querySelector('#screensortFileName');
screensortFileName.value = 'screensortFileName';
let longScreensortFileName = document.querySelector('#longScreensortFileName');
longScreensortFileName.value = 'longScreensortFileName';
let pathScreensortFileName = document.querySelector('#pathScreensortFileName');
pathScreensortFileName.value = 'pathScreensortFileName';

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