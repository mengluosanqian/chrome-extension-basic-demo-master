var btn = document.getElementById("button");
btn.onclick = function () {
    chrome.tabs.captureVisibleTab(null, {}, function (dataUrl) {
        console.log(dataUrl);
        let screensortImg = document.querySelector('#screenshotImg');
        screensortImg.src = `${dataUrl}`;
    });
}