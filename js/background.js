// 获取当前tabId
function getCurrentTabId() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      console.log(tabs, 'tabs');
      resolve(tabs.length ? tabs[0].id : null)
    })
  })
}
// create context menu
var contexts = ["page", "image", "selection", "editable", "link", "video", "audio"];


async function on_click_wa_single(info, tab) {
  const tabId = await getCurrentTabId();
  console.log(tabId);

  chrome.tabs.captureVisibleTab(tab.windowId, {}, function (dataUrl) {
    console.log(dataUrl);
    chrome.runtime.sendMessage(null, {
      type: 'screen',
      tabId: tabId,
      dataUrl: dataUrl
    }, res => {
      console.log(res);
    })
  });
}


chrome.contextMenus.create({
  "id": 'screen',
  title: '截屏',
  contexts: contexts, // 限定菜单出现的上下文为页面
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  console.log(info, tab);
  if (info.menuItemId === 'screen') {
    // on_click_wa_single(info, tab);
    download_image(info.pageUrl, null, "");
  }
  console.log('用户点击了菜单项');
  console.log(info); // 打印出点击菜单时的相关信息
  console.log(tab); // 打印出当前所在的标签页信息
});

function download_image(url, view, folder, pageurl) {
  console.log(url, view, folder, pageurl, 'url, view, folder, pageurl');
  var options = {
    url: url
  };
  chrome.downloads.download(options, (function (u, v, f) {
    return function (id) {

      download_items[id] = {
        url: u,
        view: v,
        folder: f,
        pageurl: pageurl
      };

    }
  })(url, view, folder));
}


function clickAndGetAllImage(info, tab) {
  chrome.tabs.sendRequest(tab.id, { type : "display-all-images"}, function(res) {
    res = res || {};
    res.track_from = info.track_from;
  });

}

function clickAndGetPathFrame(info, tab) {
  chrome.tabs.sendRequest(tab.id, { type : "get-path-frame"}, function(res) {
    res = res || {};
    res.track_from = info.track_from;
  });

}