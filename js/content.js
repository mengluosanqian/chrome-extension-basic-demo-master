chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case "display-all-images":
      insertDomToFrame();
      sendResponse({});
      break;
    case "get-path-frame":
      insertDomToFrame();
      sendResponse({});
      break;
    default:
      sendResponse({});
      break;
  }
});

function generate_response(imgs) {
  return {
    type: 'display-images',
    imgs: imgs,
    data: {
      cookie: document.cookie, // 用于处理防盗链
      title: document.title, // 用于显示默认标题
      pageUrl: location.href // 用于保存来源地址
    }
  };
}

function get_all_images() {
  var links = [];
  var docs = [];
  try {
    docs = [].slice.apply(window.frames);
    docs = docs.map(function (e) {
      return e.document;
    });
  } catch (e) {
    console.log("[content] error-> " + e);
    docs = [];
  }
  docs.push(document);
  for (var i = 0; i < docs.length; i++) {
    var images = get_document_images(docs[i]);
    links = links.concat(images);
  }

  return links;
}

function get_document_images(doc) {
  var imgs = doc.getElementsByTagName('img');
  var links = [].slice.apply(imgs);
  links = links.map(function (element) {
    return {
      src: element.src
    };
  });

  var all = document.all;
  for (var i = 0; i != all.length; i++) {
    var e = all[i];
    if (e.nodeType == 1) {
      var url = "";
      if (e.currentStyle && e.currentStyle.backgroundImage) {
        url = e.currentStyle.backgroundImage
      } else if (e.style && e.style.backgroundImage) {
        url = e.style.backgroundImage;
      }
      if (url != "" && /^url\(/.test(url)) {
        url = url.replace(/^url\("?/, '').replace(/"?\)$/, '');
        links.push({
          src: url
        });
      }
    }
  }

  return links;
}

function addEleToPage() {
  let div = document.createElement('div');
  div.innerHTML = '<p>这是一段文字</p>';
  document.body.appendChild(div);
}

function insertDomToFrame() {
  let innerDom = document.createElement('div');
  innerDom.id = 'insert-set-dom';
  innerDom.style.width = '100vw';
  innerDom.style.height = '100vh';
  innerDom.style.position = 'fixed';
  innerDom.style.top = 0;
  innerDom.style.left = 0;
  innerDom.style.display = 'block';
  innerDom.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
  innerDom.style.zIndex = 2000000;
  document.querySelector('html').prepend(innerDom);
}