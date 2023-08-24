chrome.runtime.onMessage.addListener(handleMessage);
async function handleMessage(request, sender, sendResponse) {
  if (request && request.type === 'pathScreensort') {
    sendResponse('来自background的消息')
    const tabId = await getCurrentTabId();
    chrome.tabs.sendMessage(tabId, "局部截图:", function (res) {
      console.log('background info:', res);
    })
    return true
  }
}

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
  if (info.menuItemId === 'screen') {
    on_click_wa_single(info, tab);
  }
  console.log('用户点击了菜单项');
  console.log(info); // 打印出点击菜单时的相关信息
  console.log(tab); // 打印出当前所在的标签页信息
});